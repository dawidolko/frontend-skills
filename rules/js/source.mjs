/*
 * Shared by the script checks of the js, ts and framework rules: finds the JavaScript of a file (the whole file for
 * .js/.jsx/.tsx, the <script> blocks of HTML, Vue, Svelte and the front matter and scripts of Astro) and blanks out
 * comments, string contents, template literal text and regular expression literals, keeping every character's
 * position and every line break. A check then searches code with a regular expression and maps a match back to
 * its line with ctx.lineOf(offset + index), without reporting words that only appear in a comment or a string.
 * It is a light scanner, not a parser: what it cannot classify it leaves as code.
 */

const REGEX_BEFORE = /[(,=:[!&|?{};+\-*%<>~^]$/
const REGEX_KEYWORDS = /(?:^|[^\w$.])(?:return|typeof|case|do|else|in|of|void|throw|delete|new|yield|await)$/
const SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi
const NOT_JS = /\btype\s*=\s*["']?(?:application\/(?:ld\+)?json|importmap|text\/(?:template|html|x-template)|speculationrules)/i

/** The script parts of a file: [{ text, offset, ts }]; ts is true when the block is TypeScript. */
export function scriptBlocks(ctx) {
  if (ctx.kind === 'jsx') return [{ text: ctx.text, offset: 0, ts: /\.tsx?$/i.test(ctx.file) }]
  const out = []
  if (ctx.kind === 'astro') {
    const fm = /^\s*---\r?\n([\s\S]*?)\n---/.exec(ctx.text)
    if (fm) out.push({ text: fm[1], offset: fm.index + fm[0].indexOf(fm[1]), ts: true })
  }
  if (!['html', 'vue', 'svelte', 'astro'].includes(ctx.kind)) return out
  SCRIPT.lastIndex = 0
  let m
  while ((m = SCRIPT.exec(ctx.text))) {
    if (NOT_JS.test(m[1]) || /\bsrc\s*=/.test(m[1])) continue
    out.push({ text: m[2], offset: m.index + m[0].indexOf('>') + 1, ts: /\blang\s*=\s*["']?ts\b/.test(m[1]) || ctx.kind === 'astro' })
  }
  return out
}

/**
 * The same text with comments, string and template contents and regex literals replaced by spaces. Quotes and
 * backticks stay, and so does the code inside ${...} of a template literal.
 */
export function blank(text) {
  const out = text.split('')
  const n = text.length
  const wipe = (a, b) => {
    for (let k = a; k < b && k < n; k++) if (out[k] !== '\n') out[k] = ' '
  }
  let last = ''
  const templates = []
  let depth = 0
  let i = 0
  while (i < n) {
    const c = text[i]
    if (c === '/' && text[i + 1] === '/') {
      const e = text.indexOf('\n', i)
      const end = e === -1 ? n : e
      wipe(i, end)
      i = end
      continue
    }
    if (c === '/' && text[i + 1] === '*') {
      const e = text.indexOf('*/', i + 2)
      const end = e === -1 ? n : e + 2
      wipe(i, end)
      i = end
      continue
    }
    if (c === '"' || c === "'") {
      let j = i + 1
      while (j < n && text[j] !== c && text[j] !== '\n') j += text[j] === '\\' ? 2 : 1
      wipe(i + 1, j)
      i = j + 1
      last = c
      continue
    }
    if (c === '`' || (c === '}' && templates.length && templates[templates.length - 1] === depth)) {
      if (c === '}') templates.pop()
      let j = i + 1
      while (j < n && text[j] !== '`' && !(text[j] === '$' && text[j + 1] === '{')) j += text[j] === '\\' ? 2 : 1
      wipe(i + 1, j)
      if (text[j] === '$') {
        templates.push(depth)
        i = j + 2
        last = '{'
      } else {
        i = j + 1
        last = '`'
      }
      continue
    }
    if (c === '/') {
      const before = text.slice(Math.max(0, i - 12), i).trimEnd()
      if (!before || REGEX_BEFORE.test(before) || REGEX_KEYWORDS.test(before)) {
        let j = i + 1
        let cls = false
        while (j < n && text[j] !== '\n') {
          if (text[j] === '\\') j++
          else if (text[j] === '[') cls = true
          else if (text[j] === ']') cls = false
          else if (text[j] === '/' && !cls) break
          j++
        }
        if (text[j] === '/') {
          wipe(i + 1, j)
          i = j + 1
          last = '/'
          continue
        }
      }
    }
    if (c === '{') depth++
    else if (c === '}') depth--
    if (!/\s/.test(c)) last = c
    i++
  }
  return out.join('')
}

/** Every match of re (global) in the code of the file: [{ match, index (in the file), code, offset }]. */
export function findInCode(ctx, re) {
  const found = []
  for (const block of scriptBlocks(ctx)) {
    const code = blank(block.text)
    re.lastIndex = 0
    let m
    while ((m = re.exec(code))) {
      found.push({ match: m, index: block.offset + m.index, code, offset: block.offset, ts: block.ts, raw: block.text })
      if (m[0] === '') re.lastIndex++
    }
  }
  return found
}

/**
 * Every match of re (global) in the original text of the file's scripts whose first character is code (not in a
 * comment or a string), for patterns that must read string contents such as event names.
 */
export function findInRaw(ctx, re) {
  const found = []
  for (const block of scriptBlocks(ctx)) {
    const code = blank(block.text)
    re.lastIndex = 0
    let m
    while ((m = re.exec(block.text))) {
      if (code[m.index] === block.text[m.index]) found.push({ match: m, index: block.offset + m.index, at: m.index, code, offset: block.offset, ts: block.ts, raw: block.text })
      if (m[0] === '') re.lastIndex++
    }
  }
  return found
}

/** Splits the inside of a call's parentheses (blanked code) into top-level arguments: [{ start, end }]. */
export function splitArgs(code, open, close) {
  const out = []
  let depth = 0
  let start = open + 1
  for (let i = open + 1; i < close - 1; i++) {
    const c = code[i]
    if ('([{'.includes(c)) depth++
    else if (')]}'.includes(c)) depth--
    else if (c === ',' && depth === 0) {
      out.push({ start, end: i })
      start = i + 1
    }
  }
  if (code.slice(start, close - 1).trim()) out.push({ start, end: close - 1 })
  return out
}

/** The index after the bracket that closes the one at code[open], or -1. */
export function closing(code, open) {
  const pairs = { '(': ')', '[': ']', '{': '}' }
  const stack = []
  for (let i = open; i < code.length; i++) {
    const c = code[i]
    if (pairs[c]) stack.push(pairs[c])
    else if (c === ')' || c === ']' || c === '}') {
      if (stack.pop() !== c) return -1
      if (stack.length === 0) return i + 1
    }
  }
  return -1
}
