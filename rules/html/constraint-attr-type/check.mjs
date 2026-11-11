/*
 * html/constraint-attr-type: reports validation attributes that the input's type ignores, so the constraint the
 * author expected never runs: pattern, minlength and maxlength outside the text-like types, min, max and step
 * outside number, range and the date and time types. Inputs with a spread or a bound type are skipped.
 */
import { staticValue } from '../../../engine/helpers.mjs'

const TEXTLIKE = new Set(['text', 'search', 'url', 'tel', 'email', 'password'])
const RANGED = new Set(['number', 'range', 'date', 'month', 'week', 'time', 'datetime-local'])
const ALLOWED = { pattern: TEXTLIKE, minlength: TEXTLIKE, maxlength: TEXTLIKE, min: RANGED, max: RANGED, step: RANGED }

export default {
  check(ctx) {
    for (const el of ctx.elements('input')) {
      if (el.spread || el.attrs.get('type')?.dynamic) continue
      const type = (staticValue(el, 'type') || 'text').toLowerCase()
      if (['hidden', 'submit', 'button', 'reset', 'image', 'checkbox', 'radio', 'file', 'color'].includes(type) && !el.attrs.has('pattern')) continue
      for (const [name, types] of Object.entries(ALLOWED))
        if (el.attrs.has(name) && !types.has(type)) {
          ctx.report(el, `${name} does nothing on type="${type}"; ${name === 'pattern' || name.endsWith('length') ? 'use min, max and step, or a text-like type' : 'use pattern, minlength or maxlength, or a number or date type'}.`)
          break
        }
    }
  }
}
