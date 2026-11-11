/*
 * a11y/aria-ref-exists: in a whole HTML document, reports aria-labelledby, aria-describedby, aria-errormessage and
 * aria-details values that name an id no element of the document has, or an id that two elements share. Template
 * files and components are skipped, because the id may live in another file; so is any document whose ids are
 * written by a template language or bound at run time.
 */
import { isDocument } from '../../../engine/helpers.mjs'

const REFS = ['aria-labelledby', 'aria-describedby', 'aria-errormessage', 'aria-details']

export default {
  check(ctx) {
    if (!isDocument(ctx)) return
    const all = ctx.elements()
    const ids = new Map()
    for (const el of all) {
      const id = el.attrs.get('id')
      if (!id) continue
      if (id.dynamic || /[{}$<%]/.test(id.value)) return
      ids.set(id.value, (ids.get(id.value) || 0) + 1)
    }
    for (const el of all) {
      for (const name of REFS) {
        const a = el.attrs.get(name)
        if (!a || a.dynamic || /[{}$<%]/.test(a.value)) continue
        for (const ref of a.value.trim().split(/\s+/).filter(Boolean)) {
          const n = ids.get(ref) || 0
          if (n === 0) ctx.report(el, `${name}="${ref}" points to no element; the id is missing or misspelled.`)
          else if (n > 1) ctx.report(el, `${name}="${ref}" matches ${n} elements; ids must be unique.`)
        }
      }
    }
  }
}
