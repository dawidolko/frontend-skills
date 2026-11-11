/*
 * perf/font-preconnect: reports a Google Fonts stylesheet link when the same file (the document or layout that
 * renders the head) has no <link rel="preconnect"> to fonts.gstatic.com with crossorigin, the origin the font
 * files come from. Self-hosted fonts need no preconnect.
 */
import { staticValue } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    const links = ctx.elements('link')
    const sheet = links.find((el) => /fonts\.googleapis\.com\/css/.test(staticValue(el, 'href') || ''))
    if (!sheet) return
    const ok = links.some(
      (el) =>
        /(^|\s)preconnect(\s|$)/i.test(staticValue(el, 'rel') || '') && /fonts\.gstatic\.com/.test(staticValue(el, 'href') || '') && el.attrs.has('crossorigin')
    )
    if (!ok)
      ctx.report(
        sheet,
        'Google Fonts files come from fonts.gstatic.com; add <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>, or self-host the fonts.'
      )
  }
}
