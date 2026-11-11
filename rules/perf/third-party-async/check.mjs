/*
 * perf/third-party-async: reports a <script> with an absolute or protocol-relative src outside <head> that has no
 * async, defer or type="module". Scripts in <head> are perf/render-blocking-script's; JSON, import maps and other
 * non-JavaScript types, spreads and bound attributes are skipped.
 */
import { mayHave, staticValue } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements('script')) {
      if (el.spread || el.ancestors.includes('head')) continue
      const src = staticValue(el, 'src')
      if (!src || !/^(https?:)?\/\//i.test(src.trim())) continue
      const type = (staticValue(el, 'type') || '').toLowerCase()
      if (type && !/^(text|application)\/(javascript|ecmascript)$/.test(type)) continue
      if (mayHave(el, 'async') || mayHave(el, 'defer')) continue
      ctx.report(el, `<script src="${src.slice(0, 60)}"> blocks the parser; add async (independent tags) or defer (ordered).`)
    }
  }
}
