/*
 * html/no-number-for-codes: reports <input type="number"> whose name, id or autocomplete token says it holds a code
 * made of digits (postal code, card number, security code, one-time code, PIN, phone, account number). Inputs with
 * a spread or a bound type are skipped.
 */
import { staticValue } from '../../../engine/helpers.mjs'

const CODE_WORDS = new Set(['zip', 'zipcode', 'postal', 'postcode', 'card', 'cvc', 'cvv', 'csc', 'otp', 'pin', 'phone', 'tel', 'iban', 'account', 'code'])

/** The words of a name, id or token: camelCase, kebab-case and snake_case split apart. */
const words = (s) =>
  s
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)

export default {
  check(ctx) {
    for (const el of ctx.elements('input')) {
      if (el.spread || (staticValue(el, 'type') || '').toLowerCase() !== 'number') continue
      const hint = [staticValue(el, 'name'), staticValue(el, 'id'), staticValue(el, 'autocomplete')].filter(Boolean).join(' ')
      if (words(hint).some((w) => CODE_WORDS.has(w)))
        ctx.report(el, `type="number" drops leading zeros and adds a spinner to a code; use type="text" inputmode="numeric" (with autocomplete and pattern).`)
    }
  }
}
