/*
 * js/strict-equality: reports == and != in script code (not in strings, comments or regular expressions). A
 * comparison with null (x == null, x != null) is left out, because it is a common deliberate test for "null or
 * undefined".
 */
import { findInCode } from '../source.mjs'

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /(?<![=!<>])(==|!=)(?!=)/g)) {
      const after = f.code.slice(f.match.index + 2, f.match.index + 12)
      const before = f.code.slice(Math.max(0, f.match.index - 8), f.match.index)
      if (/^\s*null\b/.test(after) || /\bnull\s*$/.test(before)) continue
      ctx.report(ctx.lineOf(f.index), `Use ${f.match[1]}= instead of ${f.match[1]}; loose equality converts types first.`)
    }
  }
}
