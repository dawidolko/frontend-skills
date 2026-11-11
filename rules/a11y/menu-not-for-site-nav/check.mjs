/*
 * a11y/menu-not-for-site-nav: reports role="menu" or role="menubar" inside a <nav> element, where a list of
 * links (and disclosure buttons for sub-lists) is the expected pattern. Bound roles are skipped.
 */
import { literal } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      if (el.component || !el.ancestors.includes('nav')) continue
      const r = (literal(el.attrs.get('role')) || '').trim().toLowerCase()
      if (!/^(menu|menubar)$/.test(r)) continue
      ctx.report(el, `role="${r}" inside <nav>: site navigation is a list of links; menu roles promise arrow-key behaviour and hide the links' semantics.`)
    }
  }
}
