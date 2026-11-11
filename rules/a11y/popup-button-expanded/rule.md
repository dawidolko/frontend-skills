---
id: a11y/popup-button-expanded
title: A control that opens a popup (aria-haspopup or role="combobox") has aria-expanded that follows the open state.
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
skill: fe-a11y-menus
since: 0.1.0
sources:
  - title: WAI-ARIA Authoring Practices, Menu Button pattern
    url: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
  - title: W3C, WAI-ARIA 1.2, aria-expanded
    url: https://www.w3.org/TR/wai-aria-1.2/#aria-expanded
  - title: WCAG 2.2, Understanding SC 4.1.2 Name, Role, Value
    url: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html
---

## Why

`aria-haspopup` says a menu or list will appear; without `aria-expanded` a screen reader user cannot tell whether it is open now, so they do not know whether to look for it or press the button again. A combobox requires the attribute.

## Fix

Add `aria-expanded="false"` to the trigger and switch it to `true` when the popup opens, from the same state that shows the popup. Close it on Escape and when focus leaves.

## Examples

```html
<!-- bad -->
<button type="button" aria-haspopup="menu">Actions</button>
<!-- good -->
<button type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="row-actions">Actions</button>
```
