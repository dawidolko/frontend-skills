---
id: a11y/combobox-on-input
title: role="combobox" sits on the input itself (ARIA 1.2), not on a wrapper element that contains the input.
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
  - aria-required-children
skill: fe-a11y-combobox
since: 0.1.0
sources:
  - title: WAI-ARIA Authoring Practices, Combobox pattern
    url: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
  - title: W3C, WAI-ARIA 1.2, combobox role
    url: https://www.w3.org/TR/wai-aria-1.2/#combobox
---

## Why

The wrapper shape comes from older ARIA versions. Current screen readers expect the focused input to be the combobox; with the role on a `div` they announce a plain edit field and never say that suggestions exist or which one is highlighted.

## Fix

Put `role="combobox"`, `aria-expanded`, `aria-controls` (the listbox id) and `aria-autocomplete` on the `<input>`, keep its `<label>`, and drop the wrapper's role and `aria-owns`. A select-only combobox (no typing) puts the role on a focusable `div` or `button` and has no input.

## Examples

```html
<!-- bad -->
<div role="combobox" aria-expanded="false"><input type="text"></div>
<!-- good -->
<input type="text" role="combobox" aria-expanded="false" aria-controls="list" aria-autocomplete="list">
```
