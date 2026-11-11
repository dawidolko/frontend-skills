/*
 * perf/srcset-sizes: reports an <img> or <source> whose srcset lists width descriptors (800w) but has no sizes
 * attribute, so the browser assumes the image fills the viewport, and a srcset that mixes width and density (2x)
 * descriptors. Bound srcset values and elements with a spread are skipped.
 */
import { staticValue } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements(['img', 'source'])) {
      const srcset = staticValue(el, 'srcset')
      if (el.spread || !srcset) continue
      const descriptors = srcset.split(',').map((c) => c.trim().split(/\s+/)[1] || '1x')
      const widths = descriptors.some((d) => /^\d+w$/.test(d))
      if (widths && descriptors.some((d) => /^\d*\.?\d+x$/.test(d))) ctx.report(el, 'srcset mixes width (w) and density (x) descriptors; use w for every candidate.')
      else if (widths && !el.attrs.has('sizes')) ctx.report(el, 'srcset uses width descriptors but there is no sizes, so the browser assumes 100vw and fetches a larger file than needed; add sizes.')
    }
  }
}
