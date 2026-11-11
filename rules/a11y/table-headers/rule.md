---
id: a11y/table-headers
title: Data tables mark their header cells with th (with scope when needed); layout tables carry role="presentation".
severity: serious
check: static
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
axe:
  - td-has-header
  - th-has-data-cells
skill: fe-a11y-tables
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 1.3.1 Info and Relationships
    url: https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html
  - title: W3C WAI tutorials, Tables
    url: https://www.w3.org/WAI/tutorials/tables/
  - title: WCAG 2.2 Technique H63, using the scope attribute
    url: https://www.w3.org/WAI/WCAG22/Techniques/html/H63
---

## Why

Screen readers read a cell together with its column and row headers ("Price, Basic: Free"). With bold `<td>` cells instead of `<th>`, a table of numbers becomes a list of values with no meaning.

## Fix

Use `<th scope="col">` for column headers (in `<thead>`) and `<th scope="row">` for the first cell of each row when it names the row. Add a `<caption>`. For tables used only to lay out an email or a legacy page, set `role="presentation"`.

## Examples

```html
<!-- bad -->
<table><tr><td><b>Plan</b></td><td><b>Price</b></td></tr><tr><td>Basic</td><td>Free</td></tr></table>
<!-- good -->
<table>
  <caption>Plans</caption>
  <thead><tr><th scope="col">Plan</th><th scope="col">Price</th></tr></thead>
  <tbody><tr><th scope="row">Basic</th><td>Free</td></tr></tbody>
</table>
```
