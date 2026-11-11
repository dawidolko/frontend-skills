---
id: a11y/font-size-relative
title: The root font size is not set in pixels, so text follows the reader's default size; use rem for type.
severity: minor
check: static
applies:
  - css
  - scss
  - less
  - html
  - vue
  - svelte
  - astro
wcag:
  - 1.4.4
level: AA
skill: fe-a11y-visual
since: 0.1.0
sources:
  - title: WCAG 2.2 Technique C28, specifying the size of text containers using em units
    url: https://www.w3.org/WAI/WCAG22/Techniques/css/C28
  - title: MDN, font-size (accessibility concerns)
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/font-size
---

## Why

A pixel size on `html` overrides the default text size a reader chose in the browser settings. Page zoom still works, so this is not a WCAG failure on its own, but people who only raise the default size get no larger text.

## Fix

Leave the root size alone, or set it as a percentage (`100%`), and size type in `rem`. If the design system needs 10px maths, use `62.5%` on the root and keep every other size in rem.

## Examples

```css
/* bad */
html { font-size: 16px; }
/* good */
html { font-size: 100%; }
h1 { font-size: 2.5rem; }
```
