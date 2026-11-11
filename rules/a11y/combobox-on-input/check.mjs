/*
 * a11y/combobox-on-input: reports role="combobox" on a wrapper element that contains an <input>, the ARIA 1.0 and
 * 1.1 shape that screen readers no longer support well. ARIA 1.2 puts the role on the input itself (or on a
 * focusable element for a select-only combobox, which contains no input and is not reported).
 */
import { literal } from '../../../engine/helpers.mjs'

function inside(el, parent) {
  for (let p = el.parent; p; p = p.parent) if (p === parent) return true
  return false
}

export default {
  check(ctx) {
    const all = ctx.elements()
    for (const el of all) {
      if (el.component || el.name === 'input') continue
      if ((literal(el.attrs.get('role')) || '').trim().toLowerCase() !== 'combobox') continue
      const input = all.find((d) => d.name === 'input' && !d.component && inside(d, el))
      if (input) ctx.report(el, `role="combobox" is on a wrapping <${el.name}>; move it, with aria-expanded and aria-controls, to the <input>.`)
    }
  }
}
