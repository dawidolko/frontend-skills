---
id: a11y/table-caption
title: A data table has a name, from a caption element or aria-labelledby pointing at the heading above it.
severity: minor
check: manual
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
wcag:
  - 1.3.1
level: A
skill: fe-a11y-tables
since: 0.1.0
sources:
  - title: W3C WAI tutorials, Tables, caption and summary
    url: https://www.w3.org/WAI/tutorials/tables/caption-summary/
  - title: WCAG 2.2 Technique H39, using caption elements
    url: https://www.w3.org/WAI/WCAG22/Techniques/html/H39
---

## Why

Screen reader users can list the tables on a page and jump between them. Without a name they hear "table, 5 columns, 12 rows" for each one and must read cells to find the right table.

## Fix

Add `<caption>` as the first child of `<table>` (it can be visually hidden if a heading already shows the title), or point `aria-labelledby` at the heading that introduces the table.

## Examples

```html
<h2 id="orders-title">Recent orders</h2>
<table aria-labelledby="orders-title">…</table>
```
