/*
 * seo/og-absolute-url: reports og:image, og:url, og:video and twitter:image meta tags whose static content is not an
 * absolute http(s) URL. Bound values are skipped.
 */
import { literal } from '../../../engine/helpers.mjs'

const KEYS = /^(og:image(:url|:secure_url)?|og:url|og:video(:url)?|og:audio|twitter:image)$/i

export default {
  check(ctx) {
    for (const el of ctx.elements('meta')) {
      const key = literal(el.attrs.get('property')) ?? literal(el.attrs.get('name'))
      if (!key || !KEYS.test(key.trim())) continue
      const content = literal(el.attrs.get('content'))
      if (content === null || /\{\{|\$\{/.test(content)) continue
      if (!/^https?:\/\//i.test(content.trim())) ctx.report(el, `${key} content="${content}" must be an absolute URL; social platforms do not resolve relative paths.`)
    }
  }
}
