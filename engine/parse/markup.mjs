/*
 * Finds the elements of a template with their attributes, line numbers and ancestors, without building a full DOM.
 * It reads HTML and the template dialects of Vue, Svelte, Astro and Angular in "markup" mode, and JSX inside
 * JavaScript and TypeScript files in "script" mode, where a JSX element is recognised only where an expression may
 * start (after "(", "=", "return", "=>", "&&" and similar), so comparisons and TypeScript generics are not taken for
 * tags. Attribute names are normalised to their HTML names (className -> class, onClick -> onclick, :alt -> alt,
 * (click) -> onclick); a bound value is marked dynamic, and a spread ({...props}, v-bind="obj") marks the element so
 * that a rule never reports an attribute as missing when it may come from the spread. Whatever cannot be parsed is
 * skipped, never guessed. The audit engine and the rules read the result through ctx.elements().
 */

export const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'
])
const RAW_TEXT = new Set(['script', 'style', 'textarea', 'title'])
const CLOSES_SELF = new Set(['li', 'p', 'option', 'tr', 'td', 'th', 'dt', 'dd'])
const EXPR_KEYWORDS = new Set([
  'return', 'yield', 'await', 'case', 'default', 'else', 'in', 'of', 'typeof', 'void', 'delete', 'new', 'do', 'throw', 'instanceof'
])
const NAME_START = /[A-Za-z_$]/
const JSX_NAME = /[\w$.:-]/
const WS = /\s/

/** Precomputes line starts so index -> line is a binary search. */
export function lineIndex(text) {
  const starts = [0]
  for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) === 10) starts.push(i + 1)
  return (index) => {
    let lo = 0
    let hi = starts.length - 1
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if (starts[mid] <= index) lo = mid
      else hi = mid - 1
    }
    return lo + 1
  }
}

function normalizeAttr(raw, dialect) {
  let name = raw
  let dynamic = false
  let event = false
  if (dialect === 'jsx') {
    if (name === 'className') name = 'class'
    else if (name === 'htmlFor') name = 'for'
    return { name: name.toLowerCase(), dynamic, event: /^on[A-Z]/.test(raw) }
  }
  if (dialect === 'vue') {
    if (name.startsWith('v-bind:')) [name, dynamic] = [name.slice(7), true]
    else if (name.startsWith(':')) [name, dynamic] = [name.slice(1), true]
    else if (name.startsWith('v-on:')) [name, event] = [`on${name.slice(5)}`, true]
    else if (name.startsWith('@')) [name, event] = [`on${name.slice(1)}`, true]
    name = name.split('.')[0]
  } else if (dialect === 'svelte') {
    if (name.startsWith('on:')) [name, event] = [`on${name.slice(3).split('|')[0]}`, true]
    else if (name.startsWith('bind:')) [name, dynamic] = [name.slice(5), true]
    else if (/^on[a-z]/.test(name)) event = true
  } else if (dialect === 'angular') {
    if (/^\[\(.*\)\]$/.test(name)) [name, dynamic] = [name.slice(2, -2), true]
    else if (/^\[.*\]$/.test(name)) [name, dynamic] = [name.slice(1, -1).replace(/^attr\./, ''), true]
    else if (/^\(.*\)$/.test(name)) [name, event] = [`on${name.slice(1, -1).split('.')[0]}`, true]
    else if (name.startsWith('bind-')) [name, dynamic] = [name.slice(5), true]
    else if (name.startsWith('on-')) [name, event] = [`on${name.slice(3)}`, true]
  } else if (/^on[a-z]/.test(name)) event = true
  return { name: name.toLowerCase(), dynamic, event }
}

class Scan {
  constructor(text, dialect) {
    this.s = text
    this.dialect = dialect
    this.elements = []
    this.styles = []
    this.doctype = false
    this.line = lineIndex(text)
  }

  makeElement(rawName, index, stack, dialect) {
    const parent = stack.length ? stack[stack.length - 1] : null
    const el = {
      name: /^[a-z]/.test(rawName) || dialect !== 'jsx' ? rawName.toLowerCase() : rawName,
      rawName,
      component: dialect !== 'html' && (/^[A-Z]/.test(rawName) || rawName.includes('.')),
      index,
      line: this.line(index),
      attrs: new Map(),
      spread: false,
      selfClosing: false,
      parent,
      ancestors: stack.map((e) => e.name),
      dialect
    }
    this.elements.push(el)
    return el
  }

  addAttr(el, raw, value, dynamic, index) {
    const n = normalizeAttr(raw, el.dialect)
    if (!n.name) return
    if (!el.attrs.has(n.name))
      el.attrs.set(n.name, { name: n.name, raw, value, dynamic: dynamic || n.dynamic, event: n.event, line: this.line(index) })
  }

  /* ---------- JavaScript / JSX ---------- */

  skipString(i, q) {
    const s = this.s
    i++
    while (i < s.length && s[i] !== q) {
      if (s[i] === '\\') i++
      else if (s[i] === '\n') return i
      i++
    }
    return i + 1
  }

  skipTemplate(i, stack) {
    const s = this.s
    i++
    while (i < s.length && s[i] !== '`') {
      if (s[i] === '\\') i += 2
      else if (s[i] === '$' && s[i + 1] === '{') i = this.scanJs(i + 2, true, stack)
      else i++
    }
    return i + 1
  }

  skipRegex(i) {
    const s = this.s
    let inClass = false
    i++
    while (i < s.length && s[i] !== '\n') {
      const c = s[i]
      if (c === '\\') i++
      else if (c === '[') inClass = true
      else if (c === ']') inClass = false
      else if (c === '/' && !inClass) {
        i++
        while (i < s.length && /[a-z]/i.test(s[i])) i++
        return i
      }
      i++
    }
    return i
  }

  /** Scans JavaScript from i; with untilBrace, returns the index after the matching "}". */
  scanJs(i, untilBrace, stack = []) {
    const s = this.s
    let expr = true
    let depth = 0
    while (i < s.length) {
      const c = s[i]
      if (WS.test(c)) {
        i++
        continue
      }
      if (c === '/' && s[i + 1] === '/') {
        const nl = s.indexOf('\n', i)
        i = nl === -1 ? s.length : nl
        continue
      }
      if (c === '/' && s[i + 1] === '*') {
        const e = s.indexOf('*/', i + 2)
        i = e === -1 ? s.length : e + 2
        continue
      }
      if (c === '"' || c === "'") {
        i = this.skipString(i, c)
        expr = false
        continue
      }
      if (c === '`') {
        i = this.skipTemplate(i, stack)
        expr = false
        continue
      }
      if (c === '/') {
        if (expr) {
          i = this.skipRegex(i)
          expr = false
        } else {
          i++
          expr = true
        }
        continue
      }
      if (c === '<' && expr && (NAME_START.test(s[i + 1] || '') || s[i + 1] === '>')) {
        const mark = this.elements.length
        const end = this.parseJsx(i, stack)
        if (end > 0) {
          i = end
          expr = false
          continue
        }
        this.elements.length = mark
        i++
        expr = true
        continue
      }
      if (c === '{' || c === '(' || c === '[') {
        if (c === '{') depth++
        i++
        expr = true
        continue
      }
      if (c === '}') {
        if (depth === 0 && untilBrace) return i + 1
        depth = Math.max(0, depth - 1)
        i++
        expr = true
        continue
      }
      if (c === ')' || c === ']') {
        i++
        expr = false
        continue
      }
      if (NAME_START.test(c)) {
        let j = i + 1
        while (j < s.length && /[\w$]/.test(s[j])) j++
        expr = EXPR_KEYWORDS.has(s.slice(i, j))
        i = j
        continue
      }
      if (/[0-9]/.test(c)) {
        while (i < s.length && /[\w.]/.test(s[i])) i++
        expr = false
        continue
      }
      if (c === '.' && s[i + 1] === '.' && s[i + 2] === '.') {
        i += 3
        expr = true
        continue
      }
      if ((c === '+' || c === '-') && s[i + 1] === c) {
        i += 2
        continue
      }
      i++
      expr = true
    }
    return i
  }

  /** Parses one JSX element at s[i] === "<"; returns the index after it, or -1 when it is not valid JSX. */
  parseJsx(i, stack) {
    const s = this.s
    const start = i
    i++
    let rawName = ''
    while (i < s.length && JSX_NAME.test(s[i])) rawName += s[i++]
    const el = rawName ? this.makeElement(rawName, start, stack, 'jsx') : null
    for (;;) {
      while (i < s.length && WS.test(s[i])) i++
      if (i >= s.length) return -1
      const c = s[i]
      if (c === '/' && s[i + 1] === '>') {
        if (el) el.selfClosing = true
        return i + 2
      }
      if (c === '>') {
        i++
        break
      }
      if (!el) return -1
      if (c === '{') {
        let j = i + 1
        while (WS.test(s[j] || '')) j++
        if (s.startsWith('...', j)) el.spread = true
        else if (s.startsWith('/*', j)) {
          const e = s.indexOf('*/', j)
          if (e === -1) return -1
          i = s.indexOf('}', e) + 1
          if (i === 0) return -1
          continue
        } else return -1
        i = this.scanJs(i + 1, true, stack)
        continue
      }
      if (!NAME_START.test(c)) return -1
      const at = i
      let name = ''
      while (i < s.length && /[\w$:.-]/.test(s[i])) name += s[i++]
      let j = i
      while (WS.test(s[j] || '')) j++
      if (s[j] !== '=') {
        this.addAttr(el, name, '', false, at)
        continue
      }
      j++
      while (WS.test(s[j] || '')) j++
      if (s[j] === '"' || s[j] === "'") {
        const e = s.indexOf(s[j], j + 1)
        if (e === -1) return -1
        this.addAttr(el, name, s.slice(j + 1, e), false, at)
        i = e + 1
      } else if (s[j] === '{') {
        const e = this.scanJs(j + 1, true, stack)
        this.addAttr(el, name, s.slice(j + 1, e - 1).trim(), true, at)
        i = e
      } else if (s[j] === '<') {
        const e = this.parseJsx(j, stack)
        if (e < 0) return -1
        this.addAttr(el, name, '', true, at)
        i = e
      } else return -1
    }
    const inner = el ? [...stack, el] : stack
    while (i < s.length) {
      const c = s[i]
      if (c === '<' && s[i + 1] === '/') {
        let j = i + 2
        let close = ''
        while (j < s.length && JSX_NAME.test(s[j])) close += s[j++]
        while (WS.test(s[j] || '')) j++
        if (s[j] !== '>' || close !== rawName) return -1
        if (el) el.end = j + 1
        return j + 1
      }
      if (c === '<') {
        const e = this.parseJsx(i, inner)
        if (e < 0) return -1
        i = e
        continue
      }
      if (c === '{') {
        i = this.scanJs(i + 1, true, inner)
        continue
      }
      i++
    }
    return -1
  }

  /* ---------- HTML and template dialects ---------- */

  skipBalanced(i) {
    const s = this.s
    let depth = 0
    while (i < s.length) {
      const c = s[i]
      if (c === '"' || c === "'" || c === '`') {
        i = c === '`' ? this.skipTemplate(i, []) : this.skipString(i, c)
        continue
      }
      if (c === '{') depth++
      else if (c === '}' && --depth === 0) return i + 1
      i++
    }
    return i
  }

  scanMarkup(i, end, dialect, stack = []) {
    const s = this.s
    while (i < end) {
      const c = s[i]
      if (dialect === 'vue' && c === '{' && s[i + 1] === '{') {
        const e = s.indexOf('}}', i + 2)
        i = e === -1 ? end : e + 2
        continue
      }
      if (c === '{' && dialect === 'svelte') {
        i = this.skipBalanced(i)
        continue
      }
      if (c === '{' && dialect === 'astro') {
        i = this.scanJs(i + 1, true, stack)
        continue
      }
      if (c !== '<') {
        i++
        continue
      }
      if (s.startsWith('<!--', i)) {
        const e = s.indexOf('-->', i + 4)
        i = e === -1 ? end : e + 3
        continue
      }
      if (s[i + 1] === '!' || s[i + 1] === '?') {
        if (/^<!doctype/i.test(s.slice(i, i + 9))) this.doctype = true
        const e = s.indexOf('>', i)
        i = e === -1 ? end : e + 1
        continue
      }
      if (s[i + 1] === '/') {
        const m = /^<\/([A-Za-z][\w:.-]*)\s*>/.exec(s.slice(i, i + 200))
        if (m) {
          const name = /^[A-Z]/.test(m[1]) && dialect !== 'html' ? m[1] : m[1].toLowerCase()
          for (let k = stack.length - 1; k >= 0; k--)
            if (stack[k].rawName === m[1] || stack[k].name === name) {
              stack[k].end = i + m[0].length
              stack.length = k
              break
            }
          i += m[0].length
        } else i++
        continue
      }
      if (!/[A-Za-z]/.test(s[i + 1] || '')) {
        i++
        continue
      }
      i = this.startTag(i, end, dialect, stack)
    }
  }

  startTag(i, end, dialect, stack) {
    const s = this.s
    const start = i
    i++
    let rawName = ''
    while (i < end && /[\w:.-]/.test(s[i])) rawName += s[i++]
    const lower = rawName.toLowerCase()
    if (stack.length && CLOSES_SELF.has(lower) && stack[stack.length - 1].name === lower) stack.pop()
    const el = this.makeElement(rawName, start, stack, dialect)
    if (dialect !== 'html' && /^[A-Z]/.test(rawName)) {
      el.name = rawName
      el.component = true
    }
    for (;;) {
      while (i < end && WS.test(s[i])) i++
      if (i >= end) return end
      const c = s[i]
      if (c === '>') {
        i++
        break
      }
      if (c === '/' && s[i + 1] === '>') {
        el.selfClosing = true
        return i + 2
      }
      if (c === '/') {
        i++
        continue
      }
      if (c === '{' && (dialect === 'svelte' || dialect === 'astro')) {
        const e = this.skipBalanced(i)
        const inner = s.slice(i + 1, e - 1).trim()
        if (inner.startsWith('...')) el.spread = true
        else if (/^[\w$]+$/.test(inner)) this.addAttr(el, inner, inner, true, i)
        i = e
        continue
      }
      const at = i
      let name = ''
      while (i < end && !/[\s/>="'=]/.test(s[i])) name += s[i++]
      if (!name) {
        i++
        continue
      }
      let j = i
      while (j < end && WS.test(s[j])) j++
      if (s[j] !== '=') {
        if ((dialect === 'vue' && (name === 'v-bind' || name === 'v-bind:')) || name === '{...$$restProps}') el.spread = true
        this.addAttr(el, name, '', false, at)
        continue
      }
      j++
      while (j < end && WS.test(s[j])) j++
      let value = ''
      let dynamic = false
      if (s[j] === '"' || s[j] === "'") {
        const e = s.indexOf(s[j], j + 1)
        const stop = e === -1 ? end : e
        value = s.slice(j + 1, stop)
        i = stop + 1
        if ((dialect === 'svelte' || dialect === 'astro') && /\{/.test(value)) dynamic = true
      } else if (s[j] === '{' && dialect !== 'html' && dialect !== 'vue') {
        const e = this.skipBalanced(j)
        value = s.slice(j + 1, e - 1).trim()
        dynamic = true
        i = e
      } else {
        let k = j
        while (k < end && !/[\s>]/.test(s[k])) k++
        value = s.slice(j, k)
        i = k
      }
      if (dialect === 'vue' && (name === 'v-bind' || name === ':')) el.spread = true
      this.addAttr(el, name, value, dynamic, at)
    }
    if (VOID.has(el.name)) return i
    if (RAW_TEXT.has(el.name)) {
      const re = new RegExp(`</${el.name}\\s*>`, 'ig')
      re.lastIndex = i
      const m = re.exec(s)
      const close = m && m.index < end ? m.index : end
      el.contentStart = i
      el.contentEnd = close
      if (el.name === 'title' || el.name === 'textarea') el.text = s.slice(i, close)
      if (el.name === 'style') this.styles.push({ start: i, end: close, lang: el.attrs.get('lang')?.value || 'css' })
      el.end = m && m.index < end ? close + m[0].length : end
      return el.end
    }
    stack.push(el)
    return i
  }
}

const blockRe = (tag) => new RegExp(`^<${tag}(\\s[^>]*)?>`, 'gm')

/**
 * Parses a file. kind is one of html, angular, vue, svelte, astro, jsx. Returns { elements, styles, doctype, line }
 * where styles are { start, end, lang } ranges of embedded CSS for the CSS scanner.
 */
export function parseMarkup(text, kind) {
  const scan = new Scan(text, kind === 'angular' ? 'angular' : kind)
  if (kind === 'jsx') {
    scan.scanJs(0, false, [])
  } else if (kind === 'vue') {
    const open = blockRe('template').exec(text)
    if (open) {
      const close = text.lastIndexOf('</template>')
      if (close > open.index) scan.scanMarkup(open.index + open[0].length, close, 'vue', [])
    }
    const re = blockRe('style')
    let m
    while ((m = re.exec(text))) {
      const close = text.indexOf('</style>', m.index)
      if (close === -1) break
      const lang = /lang=["']?(\w+)/.exec(m[1] || '')?.[1] || 'css'
      scan.styles.push({ start: m.index + m[0].length, end: close, lang })
    }
  } else if (kind === 'astro') {
    let start = 0
    const fm = /^\s*---\r?\n[\s\S]*?\n---/.exec(text)
    if (fm) start = fm.index + fm[0].length
    scan.scanMarkup(start, text.length, 'astro', [])
  } else {
    scan.scanMarkup(0, text.length, scan.dialect, [])
  }
  return { elements: scan.elements, styles: scan.styles, doctype: scan.doctype, line: scan.line }
}
