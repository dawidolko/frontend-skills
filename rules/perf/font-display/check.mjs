/*
 * perf/font-display: reports an @font-face block that has no font-display descriptor, and a Google Fonts
 * stylesheet URL (in a <link href> or a CSS @import) that has no display= parameter, since the CSS it returns then
 * sets no font-display either.
 */
import { staticValue } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const block of ctx.css())
      if (block.atRule === 'font-face' && !block.decls.some((d) => d.prop === 'font-display'))
        ctx.report(block.line, '@font-face has no font-display; add font-display: swap.')
    for (const el of ctx.elements('link')) {
      const href = staticValue(el, 'href') || ''
      if (/fonts\.googleapis\.com\/css/.test(href) && !/[?&]display=/.test(href))
        ctx.report(el, 'The Google Fonts URL has no display parameter; add &display=swap.')
    }
    if (!['css', 'scss', 'less'].includes(ctx.kind)) return
    for (const m of ctx.text.matchAll(/@import\s+(?:url\()?\s*['"]?[^'"\n;]*fonts\.googleapis\.com[^'"\n;)]*/g))
      if (!/[?&]display=/.test(m[0])) ctx.report(ctx.lineOf(m.index), 'The Google Fonts @import has no display parameter; add &display=swap.')
  }
}
