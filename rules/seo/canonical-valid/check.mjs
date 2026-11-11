/*
 * seo/canonical-valid: reports a rel="canonical" link whose static href is relative or holds a fragment, and every
 * canonical after the first one in the same file. Bound href values are skipped.
 */
import { literal } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    const canon = ctx.elements('link').filter((l) => (literal(l.attrs.get('rel')) || '').toLowerCase().split(/\s+/).includes('canonical'))
    for (const [i, l] of canon.entries()) {
      if (i > 0) {
        ctx.report(l, 'A second rel="canonical"; keep exactly one per page.')
        continue
      }
      const href = literal(l.attrs.get('href'))
      if (href === null || /\{\{|\$\{/.test(href)) continue
      if (!/^https?:\/\//i.test(href.trim())) ctx.report(l, `rel="canonical" href="${href}" is not an absolute URL; use https://… for the preferred address.`)
      else if (href.includes('#')) ctx.report(l, `rel="canonical" href="${href}" has a fragment; point at the page URL without #.`)
    }
  }
}
