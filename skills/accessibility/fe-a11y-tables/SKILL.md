---
name: fe-a11y-tables
description: Builds data tables that screen readers can navigate and small screens can show (WCAG 2.2 AA as a target) - th with scope, captions, sortable headers with aria-sort, responsive scroll containers, and when a table should be a list or a grid. Use when rendering tabular data, a pricing or comparison table, a data grid or an admin list in any stack, or when asked "make this table accessible".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer; the page audit needs a local Chrome.
metadata:
  title: Data tables
  area: accessibility
  lane: C
  requires: web
  globs: "**/*.html **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro **/*.component.html"
  rules: "a11y/table-headers a11y/table-caption a11y/table-sort a11y/scrollable-region-focusable a11y/reflow"
  version: 0.1.0
---

# Data tables

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson (for example the project's table component) wins over this skill.

## Rules

- Header cells are `<th>`, with `scope="col"` or `scope="row"`; never bold `<td>` (a11y/table-headers).
- Every data table has a name: `<caption>` or `aria-labelledby` (a11y/table-caption).
- Sortable headers hold a `<button>`; `aria-sort` is on the sorted column only (a11y/table-sort).
- A wide table scrolls inside a container with `tabindex="0"`, `role="region"` and a label (a11y/scrollable-region-focusable).
- The page around it reflows at 320px; only the table scrolls (a11y/reflow).
- Use a table for data with rows and columns, never for layout; layout tables get `role="presentation"`.
- Keep the native table semantics: do not set `display: block` or `grid` on `table`, `tr` or `td` without restoring roles.
- Use `role="grid"` only for spreadsheet-like editing with arrow-key navigation; a list of records is a table.

## Do this

1. Check the table component or library first (TanStack Table renders your markup; AG Grid and MUI Data Grid have their own ARIA): fix headers and names at the component level.
2. Write the skeleton: `table` > `caption` > `thead` with `th scope="col"` > `tbody` with a `th scope="row"` per row where a cell names the row.
3. For complex headers (two header rows, merged cells), use `id` on each `th` and `headers="…"` on the `td`s, or split the table.
4. For small screens, prefer a scroll container over turning rows into cards; if you do turn rows into cards, render a list or a `dl`, not a restyled table.
5. Row actions: one named button per row ("Edit invoice 1042"), not an unnamed icon.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` finds tables with data cells and no header cells, and unnamed icon buttons in rows.
- `audit --url <page>` adds axe-core's header checks and the scrollable region check on the rendered table.
- By hand: with a screen reader, move through cells with the table keys (Ctrl+Alt+arrows in NVDA and VoiceOver) and hear the headers; zoom to 400% and scroll the table alone.

## References

- [references/tables.md](references/tables.md): simple, two-axis and multi-level header markup, sortable table code, responsive patterns with their trade-offs, table versus grid. Read it when building a table component.
