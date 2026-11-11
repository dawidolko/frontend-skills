/*
 * seo/hreflang-valid: reports a <link rel="alternate" hreflang> whose static hreflang is not a language code with an
 * optional script and region (or x-default), uses "_" or the region "UK", or whose href is not an absolute URL.
 * Bound values are skipped.
 */
import { literal } from '../../../engine/helpers.mjs'

const CODE = /^(x-default|[a-z]{2,3}(-[a-z]{4})?(-([a-z]{2}|\d{3}))?)$/i

export default {
  check(ctx) {
    for (const el of ctx.elements('link')) {
      const code = literal(el.attrs.get('hreflang'))
      if (code === null) continue
      const c = code.trim()
      if (!CODE.test(c))
        ctx.report(el, `hreflang="${c}" is not valid; use a language code with an optional region, such as "en", "en-GB", "pt-BR" or "x-default".`)
      else if (/-uk$/i.test(c)) ctx.report(el, `hreflang="${c}": the region code for the United Kingdom is GB ("en-GB").`)
      const href = literal(el.attrs.get('href'))
      if (href !== null && !/\{\{|\$\{/.test(href) && !/^https?:\/\//i.test(href.trim()))
        ctx.report(el, `hreflang link href="${href}" must be an absolute URL.`)
    }
  }
}
