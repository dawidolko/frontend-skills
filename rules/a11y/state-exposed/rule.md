---
id: a11y/state-exposed
title: Custom toggles, disclosures and selections expose their state (aria-expanded, aria-pressed, aria-checked, aria-selected).
severity: serious
check: manual
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
skill: fe-a11y-aria
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 4.1.2 Name, Role, Value
    url: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html
  - title: W3C, WAI-ARIA 1.2, states and properties
    url: https://www.w3.org/TR/wai-aria-1.2/#state_prop_def
---

## Why

When only a CSS class shows that a menu is open or a filter is on, a screen reader user hears the same "button" before and after the click and cannot tell what happened.

## Fix

Bind the state attribute to the same variable that drives the class: `aria-expanded` on a button that shows and hides content, `aria-pressed` on a toggle button whose label stays the same, `aria-checked` on `role="switch"`, `aria-selected` on tabs and options, `aria-current="page"` on the current navigation link. Prefer native state (`<details open>`, `<input type="checkbox">`) when it fits.

## Examples

```jsx
// bad: the state lives only in the class
<button className={open ? 'is-open' : ''} onClick={toggle}>Filters</button>
// good
<button aria-expanded={open} aria-controls="filters" onClick={toggle}>Filters</button>
```
