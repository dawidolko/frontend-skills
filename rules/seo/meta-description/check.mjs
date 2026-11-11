/*
 * seo/meta-description: in a whole HTML document with a <head>, reports a missing or empty <meta name="description">.
 * Documents whose head is filled by a template language ({{ }}, {% %}, <% %>, <?php) are skipped, because the
 * description may come from an include.
 */
import { isDocument, literal } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    if (!isDocument(ctx)) return
    const head = ctx.elements('head')[0]
    if (!head || head.spread) return
    if (/\{\{|\{%|<%|<\?/.test(ctx.text.slice(head.index, head.end ?? ctx.text.length))) return
    const meta = ctx.elements('meta').find((m) => (literal(m.attrs.get('name')) || '').toLowerCase() === 'description')
    if (!meta) ctx.report(head, 'The page has no <meta name="description">; summarise this page in one or two sentences.')
    else {
      const c = meta.attrs.get('content')
      if (!c || (!c.dynamic && !c.value.trim())) ctx.report(meta, '<meta name="description"> is empty.')
    }
  }
}
