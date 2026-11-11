/*
 * html/password-autocomplete: reports <input type="password"> without an autocomplete token that tells password
 * managers what to do (current-password on sign-in, new-password on sign-up and change), and reports
 * autocomplete="off" on it. Inputs with a spread or a bound autocomplete are skipped.
 */
import { staticValue } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements('input')) {
      if (el.spread || (staticValue(el, 'type') || '').toLowerCase() !== 'password' || el.attrs.get('autocomplete')?.dynamic) continue
      const ac = (staticValue(el, 'autocomplete') || '').toLowerCase().trim()
      if (/(^|\s)(current-password|new-password|one-time-code)$/.test(ac)) continue
      ctx.report(el, ac === 'off'
        ? 'autocomplete="off" on a password field fights password managers; use current-password (sign-in) or new-password (sign-up, change).'
        : 'The password field has no autocomplete token; add current-password (sign-in) or new-password (sign-up, change).')
    }
  }
}
