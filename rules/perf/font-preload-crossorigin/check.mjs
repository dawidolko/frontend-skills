/*
 * perf/font-preload-crossorigin: reports <link rel="preload" as="font"> without a crossorigin attribute. Fonts are
 * always fetched in CORS mode, so a preload without it does not match the real request and the font downloads
 * twice. Links with a spread are skipped.
 */
import { staticValue } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements('link')) {
      if (el.spread) continue
      const rel = (staticValue(el, 'rel') || '').toLowerCase().split(/\s+/)
      if (!rel.includes('preload') || (staticValue(el, 'as') || '').toLowerCase() !== 'font') continue
      if (!el.attrs.has('crossorigin'))
        ctx.report(el, 'A font preload without crossorigin does not match the font request, so the font downloads twice; add crossorigin.')
    }
  }
}
