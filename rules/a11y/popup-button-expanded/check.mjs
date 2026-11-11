/*
 * a11y/popup-button-expanded: reports an element with aria-haspopup (other than "false"), or with role="combobox",
 * that has no aria-expanded attribute. Elements with a spread are skipped; a bound aria-expanded counts.
 */
import { literal } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      if (el.component || el.spread || el.attrs.has('aria-expanded')) continue
      const popup = el.attrs.get('aria-haspopup')
      const role = (literal(el.attrs.get('role')) || '').trim().toLowerCase()
      if (popup && literal(popup) !== 'false')
        ctx.report(el, `<${el.name} aria-haspopup> has no aria-expanded; set it to true or false as the popup opens and closes.`)
      else if (role === 'combobox') ctx.report(el, `<${el.name} role="combobox"> has no aria-expanded; set it to true or false as the list opens and closes.`)
    }
  }
}
