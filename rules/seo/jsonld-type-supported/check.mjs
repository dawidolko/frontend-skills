/*
 * seo/jsonld-type-supported: reports a literal JSON-LD @type whose only rich result Google has retired (FAQPage,
 * HowTo, ClaimReview, SpecialAnnouncement), so the effort brings no search feature. Types that still serve another
 * feature (Quiz for Education Q&A, Course for course lists) are not reported. Invalid JSON is left to seo/jsonld-valid.
 */
import { literal } from '../../../engine/helpers.mjs'

const RETIRED = new Set(['FAQPage', 'HowTo', 'ClaimReview', 'SpecialAnnouncement'])

function types(node, out) {
  if (Array.isArray(node)) for (const n of node) types(n, out)
  else if (node && typeof node === 'object') {
    for (const t of [].concat(node['@type'] || [])) out.add(String(t))
    for (const v of Object.values(node)) if (typeof v === 'object') types(v, out)
  }
  return out
}

export default {
  check(ctx) {
    for (const el of ctx.elements('script')) {
      if ((literal(el.attrs.get('type')) || '').toLowerCase() !== 'application/ld+json' || el.end === undefined) continue
      const open = ctx.text.indexOf('>', el.index)
      const close = ctx.text.lastIndexOf('<', el.end - 1)
      let data
      try {
        data = JSON.parse(ctx.text.slice(open + 1, close))
      } catch {
        continue
      }
      for (const t of types(data, new Set()))
        if (RETIRED.has(t)) ctx.report(el, `@type "${t}" no longer produces a rich result in Google Search; keep it only if another consumer needs it.`)
    }
  }
}
