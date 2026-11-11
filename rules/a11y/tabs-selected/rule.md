---
id: a11y/tabs-selected
title: Every role="tab" carries aria-selected, true on the active tab and false on the others.
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
  - 4.1.2
level: A
skill: fe-a11y-tabs-accordion
since: 0.1.0
sources:
  - title: WAI-ARIA Authoring Practices, Tabs pattern
    url: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
  - title: WCAG 2.2, Understanding SC 4.1.2 Name, Role, Value
    url: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html
---

## Why

Sighted users see which tab is active from its style. A screen reader user hears "tab, 2 of 4" and nothing else unless `aria-selected` says which one is shown.

## Fix

Bind `aria-selected` to the same state that styles the active tab: `true` on it, `false` on the rest. Give the active tab `tabindex="0"` and the others `tabindex="-1"`, and connect each tab to its panel with `aria-controls` and the panel back with `aria-labelledby`.

## Examples

```html
<!-- bad -->
<button role="tab" class="active">Monthly</button>
<!-- good -->
<button role="tab" aria-selected="true" aria-controls="p-monthly" id="t-monthly">Monthly</button>
```
