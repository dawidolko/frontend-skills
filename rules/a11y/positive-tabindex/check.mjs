/*
 * a11y/positive-tabindex: reports a literal tabindex above 0 on any element or component (tabIndex={2} in JSX,
 * tabindex="2" elsewhere). A value bound to a variable is not judged.
 */
import { literal } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      const v = literal(el.attrs.get('tabindex'))
      if (v !== null && Number(v) > 0) ctx.report(el, `tabindex="${v}" changes the Tab order; use 0 or -1.`)
    }
  }
}
