/*
 * responsive/viewport-meta: reports a <head> with no viewport meta tag, and a viewport meta tag whose content does
 * not set width=device-width. A head that renders a component is skipped, since the component may add the tag.
 */
import { staticValue } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    const all = ctx.elements()
    for (const head of ctx.elements('head')) {
      const inside = all.filter((e) => e.ancestors.includes('head') && e.index > head.index && (head.end === undefined || e.index < head.end))
      if (inside.some((e) => e.component || e.name === 'slot')) continue
      const vp = inside.find((e) => e.name === 'meta' && (staticValue(e, 'name') || '').toLowerCase() === 'viewport')
      if (!vp) ctx.report(head, 'The document has no viewport meta tag.')
      else if (!/width\s*=\s*device-width/i.test(staticValue(vp, 'content') || 'width=device-width'))
        ctx.report(vp, 'The viewport meta tag does not set width=device-width.')
    }
  }
}
