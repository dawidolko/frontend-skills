---
id: css/container-type-size
title: Query containers use container-type inline-size; size is only for elements that get their height from elsewhere.
severity: moderate
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
  - title: MDN, container-type
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/container-type
  - title: MDN, CSS container queries
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
---

## Why

`container-type: size` applies size containment in both directions, so the element no longer grows with its content: without a height of its own it collapses to zero and its children overflow or vanish. Most component queries only need the width.

## Fix

Use `container-type: inline-size` (or `container: name / inline-size`) to query width. Keep `size` for an element whose height is set independently (`block-size`, `aspect-ratio`, a grid track) when you really need height queries.

## Examples

```css
/* bad */
.card-list { container-type: size; }
/* good */
.card-list { container-type: inline-size; }
@container (width > 40rem) { .card { display: grid; grid-template-columns: 1fr 2fr; } }
```
