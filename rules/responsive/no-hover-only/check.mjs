/*
 * responsive/no-hover-only: reports content revealed only on hover. In CSS: a selector where :hover on an element
 * shows a descendant or sibling (display other than none, visibility: visible, opacity above 0) and no selector in
 * the same file reveals it on :focus-within, :focus or :focus-visible. In markup: Tailwind group-hover:block (flex,
 * grid, visible, opacity-100) on an element without a group-focus-within: or group-focus: counterpart.
 */
import { fullSelector } from '../../../engine/parse/css.mjs'
import { classTokens } from '../../../engine/helpers.mjs'

const REVEAL = (d) =>
  (d.prop === 'display' && d.value !== 'none') || (d.prop === 'visibility' && d.value === 'visible') || (d.prop === 'opacity' && Number.parseFloat(d.value) > 0)
const FOCUS = /:focus(-within|-visible)?/
const FOCUS_ALL = /:focus(-within|-visible)?/g
const TW_REVEAL = /^group-hover:(block|flex|inline-flex|grid|inline-block|visible|opacity-100)$/

/** Splits a selector list on its top-level commas (not those inside :is(), :not(), :where() or attribute values). */
function selectorList(sel) {
  const out = []
  let depth = 0
  let start = 0
  for (let i = 0; i < sel.length; i++) {
    const c = sel[i]
    if (c === '(' || c === '[') depth++
    else if (c === ')' || c === ']') depth--
    else if (c === ',' && depth === 0) {
      out.push(sel.slice(start, i).trim())
      start = i + 1
    }
  }
  out.push(sel.slice(start).trim())
  return out.filter(Boolean)
}

export default {
  check(ctx) {
    const blocks = ctx.css()
    const selectors = blocks.filter((b) => !b.atRule).flatMap((b) => selectorList(fullSelector(b)))
    const focusKeys = new Set(selectors.filter((s) => FOCUS.test(s)).map((s) => s.replace(FOCUS_ALL, ':STATE')))
    for (const b of blocks) {
      if (b.atRule || !b.decls.some(REVEAL)) continue
      const own = selectorList(fullSelector(b))
      for (const s of own) {
        if (!/:hover(?=\s|[>+~])/.test(s)) continue
        if (focusKeys.has(s.replace(/:hover/g, ':STATE'))) continue
        ctx.report(b.line, `"${s}" shows content on hover only; reveal it on :focus-within too and keep it reachable on touch.`)
        break
      }
    }
    if (['css', 'scss', 'less'].includes(ctx.kind)) return
    for (const el of ctx.elements()) {
      const cls = classTokens(el)
      const hover = cls.find((c) => TW_REVEAL.test(c))
      if (hover && !cls.some((c) => /^group-focus(-within|-visible)?:/.test(c)))
        ctx.report(el, `${hover} shows content on hover only; add ${hover.replace('group-hover:', 'group-focus-within:')}.`)
    }
  }
}
