/*
 * angular/router-aria-current: reports elements with routerLinkActive (literal or bound) that have neither
 * ariaCurrentWhenActive nor an aria-current attribute or binding.
 */
export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      if (el.spread || !el.attrs.has('routerlinkactive')) continue
      if (el.attrs.has('ariacurrentwhenactive') || el.attrs.has('aria-current')) continue
      ctx.report(el, 'routerLinkActive only styles the link; add ariaCurrentWhenActive="page" so the current page is announced.')
    }
  }
}
