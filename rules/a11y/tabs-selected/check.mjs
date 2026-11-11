/*
 * a11y/tabs-selected: reports an element with role="tab" that has no aria-selected attribute. A bound value counts;
 * elements with a spread are skipped.
 */
import { literal } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      if (el.component || el.spread || el.attrs.has('aria-selected')) continue
      if ((literal(el.attrs.get('role')) || '').trim().toLowerCase() !== 'tab') continue
      ctx.report(el, `<${el.name} role="tab"> has no aria-selected; set true on the active tab and false on the others.`)
    }
  }
}
