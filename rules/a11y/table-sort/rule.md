---
id: a11y/table-sort
title: Sortable columns use a button inside the th, and aria-sort only on the header of the column that is sorted.
severity: moderate
check: manual
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
wcag:
  - 2.1.1
  - 4.1.2
level: A
skill: fe-a11y-tables
since: 0.1.0
sources:
  - title: WAI-ARIA Authoring Practices, Sortable Table example
    url: https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/
  - title: W3C, WAI-ARIA 1.2, aria-sort
    url: https://www.w3.org/TR/wai-aria-1.2/#aria-sort
---

## Why

A click handler on the `<th>` cannot be reached with the keyboard and does not say it can be activated. Without `aria-sort` nobody using a screen reader knows the current order.

## Fix

Put `<button type="button">` inside each sortable `<th>` with the column name as its text; set `aria-sort="ascending"` or `"descending"` on the sorted `<th>` only, and remove it from the others. Announce the new order in a polite live region if the table is long.

## Examples

```html
<th scope="col" aria-sort="ascending"><button type="button">Date <span aria-hidden="true">▲</span></button></th>
<th scope="col"><button type="button">Amount</button></th>
```
