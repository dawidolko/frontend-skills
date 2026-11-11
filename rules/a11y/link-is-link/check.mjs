/*
 * a11y/link-is-link: reports an <a> that has a click handler but no href, an href of "#" or "javascript:" together
 * with a click handler, and any href that starts with "javascript:". Links with a spread, a bound href, a role, or
 * a router directive (routerLink, ng-href) are skipped, because they may be correct at run time.
 */
import { staticValue } from '../../../engine/helpers.mjs'

const ROUTER = ['routerlink', 'ng-href', 'xlink:href', 'to']

export default {
  check(ctx) {
    for (const el of ctx.elements('a')) {
      if (el.spread || el.attrs.has('role') || ROUTER.some((a) => el.attrs.has(a))) continue
      const href = el.attrs.get('href')
      if (href?.dynamic) continue
      const click = el.attrs.has('onclick')
      const value = href ? staticValue(el, 'href').trim() : null
      if (value !== null && /^javascript:/i.test(value)) ctx.report(el, `<a href="${value.slice(0, 30)}"> is a script link; use <button type="button"> for the action.`)
      else if (click && value === null) ctx.report(el, '<a> with a click handler and no href cannot be reached with the keyboard; use <button type="button">.')
      else if (click && value === '#') ctx.report(el, '<a href="#"> used as a button; use <button type="button">, or give the link a real URL.')
    }
  }
}
