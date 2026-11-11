/*
 * a11y/dialog-native: reports role="dialog" or role="alertdialog" on an element other than <dialog>, where the
 * native element would give focus handling, Escape and an inert background for free. Spreads and bound roles are
 * skipped.
 */
import { literal } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      if (el.component || el.spread || el.name === 'dialog') continue
      const r = literal(el.attrs.get('role'))
      if (r && /^(dialog|alertdialog)$/i.test(r.trim()))
        ctx.report(el, `<${el.name} role="${r.trim()}">: use <dialog> with showModal(), which traps focus, closes on Escape and makes the page inert.`)
    }
  }
}
