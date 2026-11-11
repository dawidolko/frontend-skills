/*
 * a11y/focus-visible: in CSS, reports a rule that removes the outline for :focus (or for every element with "*")
 * and sets no other indicator (box-shadow, border, background, text-decoration) in the same rule; the pattern
 * :focus:not(:focus-visible) is accepted. In markup, reports Tailwind's outline-none with no focus or
 * focus-visible ring, outline, border, shadow, underline or background class beside it.
 */
import { fullSelector } from '../../../engine/parse/css.mjs'
import { classTokens } from '../../../engine/helpers.mjs'

const REMOVES = (d) =>
  (d.prop === 'outline' && /^(none|0(px)?)$/i.test(d.value)) ||
  (d.prop === 'outline-style' && /^none$/i.test(d.value)) ||
  (d.prop === 'outline-width' && /^0(px)?$/i.test(d.value))
const REPLACES = new Set(['box-shadow', 'border', 'border-color', 'border-bottom', 'background', 'background-color', 'text-decoration', 'outline-color'])
const TW_REPLACE = /^(?:[\w-]+:)*focus(?:-visible|-within)?:(?:ring|outline|border|shadow|underline|bg)(?!-none$|-hidden$)/

export default {
  check(ctx) {
    for (const block of ctx.css()) {
      if (block.atRule) continue
      const removing = block.decls.find(REMOVES)
      if (!removing) continue
      const sel = fullSelector(block)
      const parts = sel.split(',').map((s) => s.trim())
      const bad = parts.some((p) => {
        if (p === '*') return true
        if (/:focus(?![-\w])/.test(p) && /:not\(\s*:focus-visible\s*\)/.test(p)) return false
        return /:focus(?:-visible)?(?![-\w])/.test(p.replace(/:not\([^)]*\)/g, ''))
      })
      if (!bad) continue
      if (block.decls.some((d) => REPLACES.has(d.prop) && !/^none$/i.test(d.value))) continue
      ctx.report(removing.line, `"${sel}" removes the focus outline with no visible replacement.`)
    }
    if (ctx.kind === 'css' || ctx.kind === 'scss' || ctx.kind === 'less') return
    for (const el of ctx.elements()) {
      const cls = classTokens(el)
      if (!cls.some((c) => /(^|:)outline-none$/.test(c))) continue
      if (cls.some((c) => TW_REPLACE.test(c))) continue
      ctx.report(el, 'outline-none removes the focus indicator; add a focus-visible:ring-* or focus-visible:outline-* class.')
    }
  }
}
