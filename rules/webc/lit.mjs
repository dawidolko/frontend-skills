/*
 * Shared by the webc rules: finds the classes of a script that extend LitElement (or HTMLElement) with their body
 * range, and the reactive property names a Lit class declares (static properties, a static properties getter,
 * and @property() / @state() decorated fields). Works on code blanked by rules/js/source.mjs.
 */
import { closing } from '../js/source.mjs'

/** Classes in blanked code: [{ name, base, start, open, end }] where open..end is the body including braces. */
export function classes(code, base = /LitElement|HTMLElement|HTML\w*Element/) {
  const out = []
  const re = /class\s+([\w$]+)?\s*extends\s+([\w$.]+(?:\([^)]*\))?)\s*\{/g
  let m
  while ((m = re.exec(code))) {
    if (!base.test(m[2])) continue
    const open = m.index + m[0].length - 1
    const end = closing(code, open)
    if (end > 0) out.push({ name: m[1] || '', base: m[2], start: m.index, open, end })
  }
  return out
}

/** Top-level keys of the object literal whose "{" is at code[open]. */
function objectKeys(code, open) {
  const end = closing(code, open)
  const keys = []
  let depth = 0
  for (let i = open; i < end; i++) {
    const c = code[i]
    if ('{[('.includes(c)) depth++
    else if ('}])'.includes(c)) depth--
    else if (depth === 1 && /[\w$]/.test(c) && !/[\w$]/.test(code[i - 1])) {
      const m = /^([\w$]+)\s*:/.exec(code.slice(i, i + 80))
      if (m) keys.push(m[1])
      i += (m ? m[1].length : 1) - 1
    }
  }
  return keys
}

/** Reactive property names of the class body code.slice(open, end), from blanked code. */
export function reactiveNames(code, cls) {
  const body = code.slice(cls.open, cls.end)
  const names = new Set()
  const stat = /static\s+(?:get\s+)?properties\s*(=\s*\{|\(\s*\)\s*\{)/.exec(body)
  if (stat) {
    let open = cls.open + stat.index + stat[0].length - 1
    if (stat[1].startsWith('(')) {
      const ret = /return\s*\{/.exec(code.slice(open, closing(code, open)))
      open = ret ? open + ret.index + ret[0].length - 1 : -1
    }
    if (open > 0) for (const k of objectKeys(code, open)) names.add(k)
  }
  const deco = /@(?:property|state)\s*\([^)]*\)\s*(?:(?:public|private|protected|readonly|declare|accessor)\s+)*([\w$]+)/g
  let m
  while ((m = deco.exec(body))) names.add(m[1])
  return names
}

/** Field declarations at the top level of a class body: [{ name, index, isStatic, modifiers }]. */
export function fields(code, cls) {
  const out = []
  let depth = 0
  let lineStart = true
  for (let i = cls.open + 1; i < cls.end - 1; i++) {
    const c = code[i]
    if (c === '\n') {
      lineStart = true
      continue
    }
    if (depth === 0 && lineStart && !/\s/.test(c)) {
      const m = /^((?:(?:static|declare|accessor|readonly|public|private|protected)\s+)*)(#?[\w$]+)\s*[?!]?\s*(?::[^=;\n]+)?(=|;|\n|$)/.exec(code.slice(i, code.indexOf('\n', i) + 1 || cls.end))
      if (m && !/^(?:get|set|async|constructor)$/.test(m[2]) && !/\(/.test(code.slice(i, i + m[0].length)))
        out.push({ name: m[2], index: i, isStatic: /\bstatic\b/.test(m[1]), modifiers: m[1] })
    }
    if (!/\s/.test(c)) lineStart = false
    if ('{[('.includes(c)) depth++
    else if ('}])'.includes(c)) depth--
  }
  return out
}
