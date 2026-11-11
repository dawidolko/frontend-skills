---
id: css/rem-helper
title: Font sizes and spacing use the project's px-to-rem helper ({{rem-function.name|its rem function}}), not raw px.
severity: minor
check: static
applies:
  - scss
  - less
  - vue
  - svelte
  - astro
requires:
  - rem-function
skill: fe-css-architecture
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 1.4.4 Resize Text
    url: https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
  - title: MDN, CSS length units (rem)
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/length
---

## Why

Sizes in rem follow the font size a person sets in the browser; sizes in px ignore it. This project already has a helper that converts the designer's px values to rem, so a raw px value is both less accessible and inconsistent with the rest of the code. The rule runs only in projects where such a helper was detected.

## Fix

Wrap the value in the project's helper: `{{rem-function.call|rem-calc(16px)}}` instead of `16px` (the helper is `{{rem-function.name|the px-to-rem function}}`, defined in `{{rem-function.file|the project's Sass functions}}`). Hairlines (`1px` borders) and `0` stay as they are.

## Examples

```scss
// bad
.card { padding: 24px; font-size: 18px; }
// good
.card { padding: rem-calc(24); font-size: rem-calc(18); }
```
