---
id: a11y/aria-label-generic
title: aria-label and aria-labelledby go on controls, landmarks and named roles, never on a plain div, span or p.
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
axe:
  - aria-prohibited-attr
skill: fe-a11y-aria
since: 0.1.0
sources:
  - title: W3C, ARIA in HTML (allowed ARIA attributes per element)
    url: https://www.w3.org/TR/html-aria/
  - title: W3C, WAI-ARIA 1.2, generic role (naming prohibited)
    url: https://www.w3.org/TR/wai-aria-1.2/#generic
  - title: WCAG 2.2, Understanding SC 4.1.2 Name, Role, Value
    url: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html
---

## Why

ARIA forbids a name on generic elements, so screen readers ignore it or read it inconsistently. The developer believes the icon or the region is labelled; the user hears nothing.

## Fix

Move the label to the thing people interact with (the `<button>` around the icon), use a landmark element (`<section aria-label>`, `<nav aria-label>`), or give the element a role that takes a name (`role="img"` for a status dot, `role="region"` for a named area).

## Examples

```html
<!-- bad -->
<span class="dot" aria-label="Online"></span>
<!-- good -->
<span class="dot" role="img" aria-label="Online"></span>
```
