/*
 * html/required-select-placeholder: reports a required single-choice <select> whose first option has a non-empty
 * value (or non-empty text when it has no value attribute), because that option is selected from the start and
 * the required check can never fail. A select with a spread, multiple or size above 1 is skipped, and so is a first
 * option whose value or text is an expression.
 */
import { staticValue } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    const options = ctx.elements('option')
    for (const el of ctx.elements('select')) {
      if (el.spread || !el.attrs.has('required') || el.attrs.has('multiple')) continue
      if (Number(staticValue(el, 'size') || 1) > 1) continue
      const first = options.find((o) => o.index > el.index && (el.end === undefined || o.index < el.end))
      if (!first || first.spread) continue
      const value = first.attrs.get('value')
      let text
      if (value) {
        if (value.dynamic) continue
        text = value.value
      } else {
        const open = ctx.text.indexOf('>', first.index)
        const close = ctx.text.indexOf('<', open)
        text = ctx.text.slice(open + 1, close).trim()
        if (/[{}]/.test(text)) continue
      }
      if (text !== '')
        ctx.report(el, 'This required select starts on a real option, so "required" never fails; add a first <option value=""> such as "Choose…".')
    }
  }
}
