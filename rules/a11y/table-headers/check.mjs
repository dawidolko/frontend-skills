/*
 * a11y/table-headers: reports a <table> that has data cells (<td>) but no header cell (<th>) anywhere. Tables with
 * role="presentation" or "none", a spread, a component inside, or a <thead> whose rows come from an expression are
 * skipped, because the header may be rendered elsewhere.
 */
import { literal } from '../../../engine/helpers.mjs'

function inside(el, parent) {
  for (let p = el.parent; p; p = p.parent) if (p === parent) return true
  return false
}

export default {
  check(ctx) {
    const all = ctx.elements()
    for (const table of all) {
      if (table.component || table.name !== 'table' || table.spread) continue
      if (/^(presentation|none)$/i.test((literal(table.attrs.get('role')) || '').trim())) continue
      const inner = all.filter((d) => inside(d, table))
      if (inner.some((d) => d.component || d.spread)) continue
      if (inner.some((d) => d.name === 'th')) continue
      if (!inner.some((d) => d.name === 'td')) continue
      const thead = inner.find((d) => d.name === 'thead')
      if (thead && !inner.some((d) => d.name === 'td' && inside(d, thead))) continue
      ctx.report(table, '<table> has data cells but no <th>; mark the header row or column with <th scope="col|row">, or role="presentation" for layout.')
    }
  }
}
