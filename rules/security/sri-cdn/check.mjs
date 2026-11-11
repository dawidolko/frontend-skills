/*
 * security/sri-cdn: reports a <script src> or <link rel="stylesheet"> that loads a versioned file from a public CDN
 * (jsDelivr, unpkg, cdnjs, code.jquery.com, the Bootstrap CDN, Google Hosted Libraries) without an integrity
 * attribute, or with integrity but no crossorigin. URLs without a version may change content, so SRI cannot be
 * used for them and they are not reported.
 */
import { literal, mayHave } from '../../../engine/helpers.mjs'

const CDN =
  /^(?:https?:)?\/\/(?:cdn\.jsdelivr\.net|unpkg\.com|cdnjs\.cloudflare\.com|code\.jquery\.com|(?:stackpath|maxcdn)\.bootstrapcdn\.com|ajax\.googleapis\.com\/ajax\/libs)\//i
const VERSIONED = /@\d|\/\d+\.\d+(\.\d+)?\/|-\d+\.\d+(\.\d+)?(\.min)?\.(js|css)$/

export default {
  check(ctx) {
    for (const el of ctx.elements(['script', 'link'])) {
      if (el.spread) continue
      if (el.name === 'link' && !(literal(el.attrs.get('rel')) || '').toLowerCase().split(/\s+/).includes('stylesheet')) continue
      const url = literal(el.attrs.get(el.name === 'script' ? 'src' : 'href'))
      if (!url || !CDN.test(url.trim()) || !VERSIONED.test(url)) continue
      if (!mayHave(el, 'integrity'))
        ctx.report(el, `${url.trim().slice(0, 110)} loads from a CDN without integrity; add integrity="sha384-…" and crossorigin="anonymous", or self-host it.`)
      else if (!mayHave(el, 'crossorigin'))
        ctx.report(el, `${url.trim().slice(0, 110)} has integrity but no crossorigin; add crossorigin="anonymous" or the check fails.`)
    }
  }
}
