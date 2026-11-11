---
id: css/logical-properties
title: Sites that run or may run right to left use logical properties (margin-inline-start, inset-inline-end), not left and right.
severity: minor
check: manual
applies:
  - css
  - scss
  - less
skill: fe-css-layout
since: 0.1.0
sources:
  - title: MDN, CSS logical properties and values
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values
  - title: W3C, Structural markup and right-to-left text in HTML
    url: https://www.w3.org/International/questions/qa-html-dir
---

## Why

`margin-left`, `padding-right`, `left` and `text-align: left` describe the screen, not the text. When the page switches to `dir="rtl"`, every one of them points the wrong way and needs an override, while logical properties follow the writing direction on their own.

## Fix

Use `margin-inline-start`/`-end`, `padding-inline`, `inset-inline-start`, `border-inline-end`, `text-align: start`, `inline-size` and `block-size`. In a site that will only ever be left to right, logical properties are still a good default for new code; do not rewrite working code for it alone.

## Examples

```css
/* bad */
.icon { margin-right: 0.5rem; }
/* good */
.icon { margin-inline-end: 0.5rem; }
```
