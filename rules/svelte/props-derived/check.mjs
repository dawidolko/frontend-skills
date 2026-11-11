/*
 * svelte/props-derived: reads the names destructured from $props() and reports a top-level let or const whose
 * initial value reads one of them without $derived (the value is captured once). Initial values wrapped in a rune,
 * functions (which read the prop when they are called), names starting with initial or default, and lines under
 * a svelte-ignore state_referenced_locally comment are left out.
 */
import { closing, findInCode, splitArgs } from '../../js/source.mjs'

function depths(code) {
  const out = new Int16Array(code.length + 1)
  let d = 0
  for (let i = 0; i < code.length; i++) {
    out[i] = d
    if ('{(['.includes(code[i])) d++
    else if ('})]'.includes(code[i])) d--
  }
  return out
}

function propNames(code, open) {
  const end = closing(code, open)
  if (end < 0) return []
  return splitArgs(code, open, end)
    .map(({ start, end: e }) => code.slice(start, e).trim().replace(/=[\s\S]*$/, '').trim())
    .map((item) => (item.startsWith('...') ? item.slice(3) : item.includes(':') ? item.split(':')[1] : item).trim())
    .filter((n) => /^[\w$]+$/.test(n))
}

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /(?:let|const)\s*\{(?=[^;]*\}\s*(?::[^=]+)?=\s*\$props\s*\()/g)) {
      const names = propNames(f.code, f.match.index + f.match[0].length - 1)
      if (names.length === 0) continue
      const words = new RegExp(`(?<![\\w$.])(?:${names.map((n) => n.replace(/\$/g, '\\$')).join('|')})(?![\\w$])(?!\\s*:)`)
      const depth = depths(f.code)
      const decl = /(?:^|[;\n])[ \t]*(?:let|const)\s+([\w$]+)\s*(?::[^=\n]+)?=\s*([^\n;]+)/g
      let m
      while ((m = decl.exec(f.code))) {
        const at = m.index + m[0].search(/(?:let|const)/)
        if (depth[at] !== 0) continue
        const init = m[2].trim()
        if (/^(?:initial|default)(?:[A-Z_$]|$)/.test(m[1])) continue
        const lineStart = f.raw.lastIndexOf('\n', at - 1)
        const above = f.raw.slice(f.raw.lastIndexOf('\n', lineStart - 1) + 1, lineStart)
        if (/svelte-ignore[^\n]*state_referenced_locally/.test(above)) continue
        if (/^\$(?:derived|state|props|bindable)\b/.test(init) || /^(?:async\s+)?(?:function\b|\([^)]*\)\s*=>|[\w$]+\s*=>)/.test(init)) continue
        if (words.test(init)) ctx.report(ctx.lineOf(f.offset + at), `${m[1]} reads a prop once; wrap the value in $derived(...) so it follows the prop.`)
      }
    }
  }
}
