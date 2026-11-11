/*
 * js/no-var: reports var declarations in script code. The word in strings (CSS var() in a template literal) and
 * comments is not code and is not reported.
 */
import { findInCode } from '../source.mjs'

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /(?<![\w$.])var\s+[A-Za-z_$[{]/g)) ctx.report(ctx.lineOf(f.index), 'Use const (or let when reassigned) instead of var.')
  }
}
