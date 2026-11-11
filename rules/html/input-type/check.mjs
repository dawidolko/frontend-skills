/*
 * html/input-type: reports an <input> with no type (or type="text") whose autocomplete token, name or id says it
 * holds an email address, a phone number or a URL, so the field gets the generic keyboard and no built-in check.
 * Inputs with a spread or a bound type are skipped.
 */
import { staticValue } from '../../../engine/helpers.mjs'

const KINDS = [
  ['email', /^(e-?mail|email-?address|user-?email|contact-?email)$/i, /(^|\s)email$/],
  ['tel', /^(phone|tel|telephone|mobile|phone-?number|mobile-?number)$/i, /(^|\s)tel(-national)?$/],
  ['url', /^(url|website|homepage|web-?site-?url)$/i, /(^|\s)url$/]
]

export default {
  check(ctx) {
    for (const el of ctx.elements('input')) {
      if (el.spread || el.attrs.get('type')?.dynamic) continue
      const type = (staticValue(el, 'type') || 'text').toLowerCase()
      if (type !== 'text') continue
      const ac = (staticValue(el, 'autocomplete') || '').toLowerCase()
      const names = [staticValue(el, 'name'), staticValue(el, 'id')].filter(Boolean)
      const hit = KINDS.find(([, re, token]) => token.test(ac) || names.some((n) => re.test(n)))
      if (hit)
        ctx.report(
          el,
          `This field holds ${hit[0] === 'tel' ? 'a phone number' : hit[0] === 'url' ? 'a URL' : 'an email address'}; use type="${hit[0]}" for the right keyboard and validation.`
        )
    }
  }
}
