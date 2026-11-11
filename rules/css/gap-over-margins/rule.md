---
id: css/gap-over-margins
title: Space the children of a flex or grid container with gap, not with margins on the children and last-child exceptions.
severity: minor
check: manual
applies:
  - css
  - scss
  - less
skill: fe-css-layout
since: 0.1.0
sources:
  - title: MDN, gap
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/gap
  - title: web.dev, Learn CSS, Spacing
    url: https://web.dev/learn/css/spacing
---

## Why

Margins on children need an exception for the first or last item, double up when items wrap, and leak out of the component. `gap` puts space only between items, in both directions, and is supported for flexbox and grid in every current browser.

## Fix

Set `gap` (or `row-gap`/`column-gap`) on the flex or grid container and remove the child margins and their `:last-child` resets. For a vertical flow of unrelated blocks, a flex column with `gap` or a single "stack" rule does the same.

## Examples

```css
/* bad */
.toolbar { display: flex; }
.toolbar > * { margin-right: 1rem; }
.toolbar > *:last-child { margin-right: 0; }
/* good */
.toolbar { display: flex; gap: 1rem; }
```
