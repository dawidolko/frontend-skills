---
id: css/light-dark-color-scheme
title: A project that uses light-dark() declares color-scheme (light dark) on :root or in a meta tag, or the dark values never apply.
severity: moderate
check: static
applies:
  - project
skill: fe-css-modern
since: 0.1.0
sources:
  - title: MDN, light-dark()
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark
  - title: MDN, color-scheme
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
---

## Why

`light-dark(a, b)` returns the dark value only when the element's used colour scheme is dark, and that comes from the `color-scheme` property (or the `color-scheme` meta tag). Without it the page always shows the light values, whatever the person chose in their system, and form controls and scrollbars stay light too.

## Fix

Add `color-scheme: light dark;` to `:root` (or `<meta name="color-scheme" content="light dark">` in the document head). For a forced theme toggle, set `color-scheme: dark` or `light` on the root element from the toggle.

## Examples

```css
/* bad */
:root { --bg: light-dark(#fff, #121212); }
/* good */
:root { color-scheme: light dark; --bg: light-dark(#fff, #121212); }
```
