/*
 * js/feature-detect: reports reads of navigator.userAgent in script code (user-agent sniffing). A line meant for
 * logging is suppressed with an fs-ignore comment.
 */
import { findInCode } from '../source.mjs'

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /\bnavigator\s*\.\s*userAgent\b(?!Data)/g))
      ctx.report(ctx.lineOf(f.index), 'Detect the feature (in, CSS.supports, matchMedia) instead of reading navigator.userAgent.')
  }
}
