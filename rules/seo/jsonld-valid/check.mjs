/*
 * seo/jsonld-valid: parses the literal content of each <script type="application/ld+json"> and reports content that
 * is not valid JSON, or that has no schema.org @context. Scripts whose content is a template expression are skipped.
 */
import { literal } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements('script')) {
      if ((literal(el.attrs.get('type')) || '').toLowerCase() !== 'application/ld+json' || el.end === undefined) continue
      const open = ctx.text.indexOf('>', el.index)
      const close = ctx.text.lastIndexOf('<', el.end - 1)
      if (open === -1 || close <= open) continue
      const body = ctx.text.slice(open + 1, close).trim()
      if (!body || /\{\{|\{%|<%|\$\{|^\{\s*[A-Za-z_$][\w$.]*\s*\(/.test(body)) continue
      let data
      try {
        data = JSON.parse(body)
      } catch (err) {
        if (/^\{[^"{]/.test(body) && ctx.kind !== 'html') continue
        ctx.report(el, `JSON-LD is not valid JSON (${err.message.split('\n')[0]}); search engines drop it.`)
        continue
      }
      const items = Array.isArray(data) ? data : [data]
      if (!items.every((d) => d && typeof d === 'object' && /schema\.org/.test(JSON.stringify(d['@context'] ?? ''))))
        ctx.report(el, 'JSON-LD has no "@context": "https://schema.org".')
    }
  }
}
