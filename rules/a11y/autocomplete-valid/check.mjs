/*
 * a11y/autocomplete-valid: reports a literal autocomplete value on input, select or textarea that is not a valid
 * sequence of tokens from the WHATWG list of autofill field names (with optional section-*, shipping/billing,
 * contact type and webauthn tokens). Bound values are not judged.
 */
import { literal } from '../../../engine/helpers.mjs'

export const FIELDS = new Set(
  (
    'name honorific-prefix given-name additional-name family-name honorific-suffix nickname username new-password ' +
    'current-password one-time-code organization-title organization street-address address-line1 address-line2 ' +
    'address-line3 address-level4 address-level3 address-level2 address-level1 country country-name postal-code ' +
    'cc-name cc-given-name cc-additional-name cc-family-name cc-number cc-exp cc-exp-month cc-exp-year cc-csc cc-type ' +
    'transaction-currency transaction-amount language bday bday-day bday-month bday-year sex url photo'
  ).split(' ')
)
export const CONTACT_FIELDS = new Set(
  'tel tel-country-code tel-national tel-area-code tel-local tel-local-prefix tel-local-suffix tel-extension email impp'.split(' ')
)
const CONTACT_TYPES = new Set(['home', 'work', 'mobile', 'fax', 'pager'])

/** True when value is a valid autocomplete attribute value. */
export function validAutocomplete(value) {
  const t = value.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (t.length === 0) return true
  if (t.length === 1 && (t[0] === 'on' || t[0] === 'off')) return true
  let i = 0
  if (t[i]?.startsWith('section-') && t[i].length > 8) i++
  if (t[i] === 'shipping' || t[i] === 'billing') i++
  let contact = false
  if (CONTACT_TYPES.has(t[i])) {
    contact = true
    i++
  }
  const field = t[i]
  if (!field) return false
  if (contact ? !CONTACT_FIELDS.has(field) : !FIELDS.has(field) && !CONTACT_FIELDS.has(field)) return false
  i++
  if (t[i] === 'webauthn') i++
  return i === t.length
}

export default {
  check(ctx) {
    for (const el of ctx.elements(['input', 'select', 'textarea', 'form'])) {
      const a = el.attrs.get('autocomplete')
      const v = literal(a)
      if (v === null) continue
      if (el.name === 'form' ? !['on', 'off'].includes(v.trim().toLowerCase()) : !validAutocomplete(v))
        ctx.report(a.line, `autocomplete="${v}" is not a value from the HTML standard.`)
    }
  }
}
