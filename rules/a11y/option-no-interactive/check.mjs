/*
 * a11y/option-no-interactive: reports an element with role="option" that contains a link, button or form field.
 * Options are selected as a whole; controls inside them are unreachable or announced twice.
 */
import { literal } from '../../../engine/helpers.mjs'

const INTERACTIVE = new Set(['a', 'button', 'input', 'select', 'textarea'])

function inside(el, parent) {
  for (let p = el.parent; p; p = p.parent) if (p === parent) return true
  return false
}

export default {
  check(ctx) {
    const all = ctx.elements()
    for (const el of all) {
      if (el.component || (literal(el.attrs.get('role')) || '').trim().toLowerCase() !== 'option') continue
      const inner = all.find((d) => !d.component && INTERACTIVE.has(d.name) && !(d.name === 'a' && !d.attrs.has('href')) && inside(d, el))
      if (inner) ctx.report(inner, `<${inner.name}> inside role="option"; options cannot hold controls, use a grid or move the action out.`)
    }
  }
}
