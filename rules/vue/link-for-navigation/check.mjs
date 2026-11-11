/*
 * vue/link-for-navigation: reports native button elements (and input type=button) whose click handler is nothing
 * but a navigation call (router.push, router.replace, $router.push, navigateTo) with a literal path or route
 * object. A handler that does more, or calls a named method, is not read. Clickable non-interactive elements are
 * reported by a11y/no-click-on-static instead.
 */
const NAV = /^\s*(?:\$?router\s*\.\s*(?:push|replace)|navigateTo)\s*\(\s*(?:["'`][^"'`]*["'`]|\{[^}]*\})\s*\)\s*;?\s*$/

export default {
  check(ctx) {
    for (const el of ctx.elements(['button', 'input'])) {
      if (el.name === 'input' && el.attrs.get('type')?.value !== 'button') continue
      const click = el.attrs.get('onclick')
      if (!click?.event || !NAV.test(click.value)) continue
      ctx.report(click.line, `This button only navigates (${click.value.trim()}); use RouterLink or NuxtLink with to.`)
    }
  }
}
