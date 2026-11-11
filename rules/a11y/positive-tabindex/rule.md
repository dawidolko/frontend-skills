---
id: a11y/positive-tabindex
title: No element has a tabindex greater than 0; focus order follows the source order.
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
  - 2.4.3
level: A
axe:
  - tabindex
skill: fe-a11y-keyboard
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 2.4.3 Focus Order
    url: https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html
  - title: MDN, the tabindex global attribute
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex
---

## Why

A positive tabindex moves the element ahead of everything else in the Tab order, so keyboard users jump around the page in an order that no longer matches what they see.

## Fix

Use `tabindex="0"` to make a custom control focusable in source order and `tabindex="-1"` for something focused only by script. Change the order by changing the DOM order, not tabindex.

## Examples

```html
<!-- bad -->
<button tabindex="3">Save</button>
<!-- good -->
<button>Save</button>
```
