/*
 * sass/math-div: reports a slash that Sass treats as division: next to a $variable, after a parenthesised
 * expression, or inside bare parentheses. Slashes in calc() and other function calls, in #{} interpolation, in
 * strings and comments, in @media, @supports and @container queries, in custom property values and between plain
 * numbers (font: 1rem/1.5, grid-area: 1 / 3) are CSS and are left out.
 */
import { findInScss } from '../scss.mjs'

const CSS_FUNCTION = /(?:var|env|attr|calc|min|max|clamp|rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color|url|image-set|repeat|minmax|fit-content)\s*$/i

function enclosingParen(code, from, to) {
  let depth = 0
  for (let i = to - 1; i >= from; i--) {
    if (code[i] === ')') depth++
    else if (code[i] === '(') {
      if (depth === 0) return i
      depth--
    }
  }
  return -1
}

function openOf(code, close) {
  let depth = 0
  for (let i = close; i >= 0; i--) {
    if (code[i] === ')') depth++
    else if (code[i] === '(' && --depth === 0) return i
  }
  return -1
}

export default {
  check(ctx) {
    const lines = new Set()
    for (const f of findInScss(ctx, /\//g, { strings: true })) {
      const p = f.at
      const code = f.code
      if (code[p - 1] === '\\' || code[p - 1] === '/' || code[p + 1] === '/') continue
      const start = Math.max(code.lastIndexOf(';', p), code.lastIndexOf('{', p), code.lastIndexOf('}', p)) + 1
      const statement = code.slice(start, p)
      if (/^\s*(?:@media|@supports|@container|@include\s+media|--)/.test(statement)) continue
      const interp = code.lastIndexOf('#{', p)
      if (interp >= start && code.indexOf('}', interp) > p) continue
      const open = enclosingParen(code, start, p)
      let division = false
      if (open >= 0) {
        if (/[\w$-]/.test(code[open - 1] || '')) continue
        division = true
      } else {
        const left = code.slice(start, p).trimEnd()
        const right = code.slice(p + 1).trimStart()
        if (/\$[\w-]+$/.test(left) || /^[$(]/.test(right)) division = true
        else if (left.endsWith(')')) {
          const o = openOf(code, start + left.length - 1)
          division = o >= 0 && !CSS_FUNCTION.test(code.slice(start, o))
        }
      }
      if (!division) continue
      const line = ctx.lineOf(f.index)
      if (lines.has(line)) continue
      lines.add(line)
      ctx.report(line, 'Division with / is deprecated in Sass; use math.div() from sass:math.')
    }
  }
}
