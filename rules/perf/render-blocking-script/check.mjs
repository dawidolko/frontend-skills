/*
 * perf/render-blocking-script: reports a <script src> inside <head> with no defer, no async and no type="module".
 * JSON, import maps and other non-JavaScript script types are skipped.
 */
import { mayHave, staticValue } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements('script')) {
      if (!el.ancestors.includes('head') || !el.attrs.has('src') || el.spread) continue
      const type = (staticValue(el, 'type') || '').toLowerCase()
      if (type && !/^(text|application)\/(javascript|ecmascript)$/.test(type)) continue
      if (mayHave(el, 'defer') || mayHave(el, 'async')) continue
      ctx.report(el, `<script src="${staticValue(el, 'src') || '…'}"> blocks rendering; add defer.`)
    }
  }
}
