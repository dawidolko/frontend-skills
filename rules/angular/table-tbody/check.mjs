/*
 * angular/table-tbody: reports a table element in an Angular template that has tr elements as direct children
 * (rows not wrapped in thead, tbody or tfoot), once per table at its first such row.
 */
export default {
  check(ctx) {
    const seen = new Set()
    for (const tr of ctx.elements('tr')) {
      const table = tr.parent
      if (!table || table.name !== 'table' || seen.has(table)) continue
      seen.add(table)
      ctx.report(tr, '<tr> is a direct child of <table>; wrap the rows in <tbody> so hydration matches the browser DOM.')
    }
  }
}
