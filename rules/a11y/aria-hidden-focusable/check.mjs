/*
 * a11y/aria-hidden-focusable: reports an element with aria-hidden="true" that can take focus itself or holds a
 * focusable element (a link with href, a button, a form field, a summary, or tabindex 0 or more). Elements that are
 * inert, disabled, or have tabindex="-1" do not count; an element or descendant with a spread is skipped.
 */
import { literal } from '../../../engine/helpers.mjs'

const NATIVE = new Set(['button', 'select', 'textarea', 'summary', 'iframe'])

function focusable(el) {
  if (el.component || el.spread) return false
  const tabindex = literal(el.attrs.get('tabindex'))
  if (tabindex !== null) return Number(tabindex) >= 0
  if (el.attrs.has('tabindex')) return false
  if (el.attrs.has('disabled')) return false
  if (el.name === 'a') return el.attrs.has('href')
  if (el.name === 'input') return (literal(el.attrs.get('type')) || '').toLowerCase() !== 'hidden'
  return NATIVE.has(el.name) || el.attrs.get('contenteditable')?.value === 'true'
}

const hidden = (el) => !el.component && !el.attrs.has('inert') && literal(el.attrs.get('aria-hidden')) === 'true'

export default {
  check(ctx) {
    const all = ctx.elements()
    const reported = new Set()
    for (const el of all) {
      if (!focusable(el)) continue
      if (hidden(el)) {
        reported.add(el)
        ctx.report(el, `<${el.name} aria-hidden="true"> can still take focus; remove aria-hidden or make it inert.`)
        continue
      }
      for (let p = el.parent; p; p = p.parent) {
        if (p.attrs.has('inert') || p.spread) break
        if (hidden(p)) {
          if (!reported.has(p)) ctx.report(p, `<${p.name} aria-hidden="true"> contains a focusable <${el.name}>; use inert, or take the control out.`)
          reported.add(p)
          break
        }
      }
    }
  }
}
