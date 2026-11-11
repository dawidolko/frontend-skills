/*
 * perf/img-dimensions: reports an <img> without both width and height. Elements with a spread, an inline style or
 * a class that sets an aspect ratio (aspect-*, aspect-ratio) are skipped.
 */
import { classTokens, mayHave, staticValue } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements('img')) {
      if (el.spread || (mayHave(el, 'width') && mayHave(el, 'height'))) continue
      if (/aspect-ratio/.test(staticValue(el, 'style') || '') || classTokens(el).some((c) => /(^|:)aspect-/.test(c))) continue
      ctx.report(el, '<img> has no width and height, so it shifts the layout when it loads.')
    }
  }
}
