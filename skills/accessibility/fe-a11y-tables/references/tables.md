# Data tables reference

Depth for the `fe-a11y-tables` skill. Rule ids in brackets: `frontend-skills explain <id>`. Read on 2026-11-11 from the W3C WAI Tables tutorial and the APG table and grid patterns.

## Headers [a11y/table-headers]

| Table shape | Markup |
| --- | --- |
| One header row | `thead` > `tr` > `th scope="col"` |
| Header row and first column | `th scope="col"` in `thead`; `th scope="row"` as the first cell of each body row |
| Header cells spanning groups | `th scope="colgroup"` / `scope="rowgroup"` with `colspan` / `rowspan` |
| Irregular (merged cells in the body) | `id` on each `th`, `headers="id1 id2"` on each `td`; or split into simpler tables |

```html
<table>
  <caption>Opening hours</caption>
  <thead>
    <tr><td></td><th scope="col">Weekdays</th><th scope="col">Weekend</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">Shop</th><td>9–18</td><td>10–14</td></tr>
    <tr><th scope="row">Café</th><td>8–20</td><td>9–20</td></tr>
  </tbody>
</table>
```

## Names [a11y/table-caption]

- `<caption>` as the first child; hide it visually with `.sr-only` if a heading already shows it.
- Or `aria-labelledby` pointing at the heading above the table.
- `summary` is obsolete; explain a complex table in a paragraph linked with `aria-describedby`.

## Sortable columns [a11y/table-sort]

```html
<th scope="col" aria-sort="descending">
  <button type="button">Amount <span aria-hidden="true">▼</span></button>
</th>
```

```js
function sortBy(th, dir) {
  for (const h of table.querySelectorAll('th[aria-sort]')) h.removeAttribute('aria-sort')
  th.setAttribute('aria-sort', dir)
  status.textContent = `Sorted by ${th.textContent.trim()}, ${dir}`
}
```

## Small screens

| Approach | Good for | Cost |
| --- | --- | --- |
| Scroll container (`overflow-x: auto`, `tabindex="0"`, `role="region"`, label) | Most data tables | Horizontal scroll inside the box (allowed by WCAG 1.4.10 for tables) |
| Hide low-priority columns behind a "Columns" control | Wide admin tables | People must know the control exists |
| Rows as cards (`ul` of `dl`) | Few columns, record-like data | Lose column comparison; render different markup, do not restyle the table |
| Sticky first column (`position: sticky; inset-inline-start: 0`) | Long rows | Check focus is not hidden under it (WCAG 2.4.11) |

```css
.table-wrap { overflow-x: auto; }
.table-wrap:focus-visible { outline: 2px solid var(--focus); }
```

Restyling `table`, `tr` and `td` with `display: block` or `grid` removes their table semantics in some browsers; if you must, add `role="table"`, `row`, `columnheader`, `rowheader` and `cell` back.

## Table or grid

| Use a table | Use `role="grid"` |
| --- | --- |
| Reading data, row actions as buttons | Spreadsheet-like editing, cell-by-cell navigation |
| Tab moves through the buttons and links | One Tab stop, arrow keys between cells, Enter or F2 to edit |
| No extra script | The whole APG grid keyboard model |

Data grid libraries (AG Grid, MUI Data Grid) implement grid roles; check their accessibility guide and run `audit --url`.

## Sources

- W3C WAI tutorials, Tables: https://www.w3.org/WAI/tutorials/tables/
- APG, Table pattern: https://www.w3.org/WAI/ARIA/apg/patterns/table/
- APG, Grid pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
- APG, Sortable Table example: https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/
- MDN, th: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/th
