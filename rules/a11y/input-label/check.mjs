/*
 * a11y/input-label: reports input, select and textarea elements that no label in the same file points to, that
 * are not inside a label, and that have no aria-label, aria-labelledby or title. Hidden and button-like inputs are
 * left out, and so is any field whose id or a label's for value is bound to an expression, because the pairing is
 * then only known at run time.
 */
import { staticValue } from '../../../engine/helpers.mjs'

const SKIP_TYPES = new Set(['hidden', 'submit', 'button', 'reset', 'image'])

export default {
  check(ctx) {
    const labels = ctx.elements('label')
    const targets = new Set()
    let dynamicFor = false
    for (const l of labels) {
      const f = l.attrs.get('for')
      if (!f) continue
      if (f.dynamic) dynamicFor = true
      else targets.add(f.value)
    }
    for (const el of ctx.elements(['input', 'select', 'textarea'])) {
      if (el.spread) continue
      const type = (staticValue(el, 'type') || '').toLowerCase()
      if (el.name === 'input' && SKIP_TYPES.has(type)) continue
      if (el.attrs.get('type')?.dynamic) continue
      if (['aria-label', 'aria-labelledby', 'title'].some((a) => el.attrs.has(a))) continue
      if (el.ancestors.includes('label')) continue
      const id = el.attrs.get('id')
      if (id && (id.dynamic || targets.has(id.value) || dynamicFor)) continue
      ctx.report(el, `<${el.name}${type ? ` type="${type}"` : ''}> has no label; add <label for>, wrap it in <label> or use aria-label.`)
    }
  }
}
