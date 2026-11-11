---
id: css/no-float-layout
title: Page and component layout uses grid or flexbox; float is only for wrapping text around media, and clearfix hacks are gone.
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
skill: fe-css-layout
since: 0.1.0
sources:
  - title: MDN, CSS grid layout
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
  - title: MDN, Floats (Learn web development, legacy layout methods)
    url: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Floats
  - title: MDN, display (flow-root)
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/display
---

## Why

Float columns need percentage widths that add up exactly, a clearfix on every row and margin tricks for gutters; they cannot align items vertically, reorder, or wrap gracefully, so they break at the widths nobody tested. Grid and flexbox have been in every browser for years and do all of it natively.

## Fix

Make the container `display: grid` (two-dimensional layouts, card grids) or `display: flex` (a row or column of items) and space children with `gap`. Delete the clearfix; if a box only has to contain a floated image, give it `display: flow-root`. Keep `float` for an image or quote that text should wrap around.

## Examples

```css
/* bad */
.row::after { content: ""; display: table; clear: both; }
.col-6 { float: left; width: 50%; }
/* good */
.row { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr)); gap: 1rem; }
```
