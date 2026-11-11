/*
 * a11y/dialog-name: reports a <dialog>, or an element with role="dialog" or role="alertdialog", that has neither
 * aria-labelledby nor aria-label. Elements with a spread or a bound role are skipped.
 */
import { literal } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      if (el.component || el.spread) continue
      const role = el.attrs.get('role')
      const r = role ? literal(role) : null
      if (role && r === null) continue
      const isDialog = r ? /^(dialog|alertdialog)$/i.test(r.trim()) : el.name === 'dialog'
      if (!isDialog || el.attrs.has('aria-labelledby') || el.attrs.has('aria-label')) continue
      ctx.report(el, `<${el.name}${r ? ` role="${r.trim()}"` : ''}> has no name; point aria-labelledby at its heading.`)
    }
  }
}
