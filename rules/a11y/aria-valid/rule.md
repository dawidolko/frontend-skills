---
id: a11y/aria-valid
title: Every role value is a real WAI-ARIA role and every aria-* attribute name exists (aria-labelledby, not aria-labeledby).
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
  - aria-roles
  - aria-valid-attr
lighthouse:
  - aria-roles
  - aria-valid-attr
skill: fe-a11y-aria
since: 0.1.0
sources:
  - title: W3C, WAI-ARIA 1.2 (roles and states and properties)
    url: https://www.w3.org/TR/wai-aria-1.2/
  - title: WCAG 2.2, Understanding SC 4.1.2 Name, Role, Value
    url: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html
---

## Why

Browsers ignore an unknown role or attribute without any error. The widget then has no role, no name or no state for assistive technology, while the code looks finished.

## Fix

Use the role names of WAI-ARIA 1.2 (`tablist`, not `tabs`) and the exact attribute names (`aria-labelledby`, `aria-describedby`). Better still, use the native element that carries the role. Lint JSX with `eslint-plugin-jsx-a11y` to catch these while typing.

## Examples

```html
<!-- bad -->
<div role="tabs"><button aria-labeledby="t1">One</button></div>
<!-- good -->
<div role="tablist"><button role="tab" aria-labelledby="t1">One</button></div>
```
