---
id: responsive/reflow
title: The page reads without sideways scrolling at 320 CSS px and 400% zoom; only tables, maps and similar may scroll both ways.
severity: serious
check: manual
applies:
  - page
wcag:
  - 1.4.10
level: AA
skill: fe-responsive
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 1.4.10 Reflow
    url: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
  - title: web.dev, Learn Responsive Design
    url: https://web.dev/learn/design
---

## Why

People who zoom to 400% on a 1280px screen see the page at 320 CSS px. If lines run off the side they have to scroll back and forth for every line, and content cut off by fixed widths, sticky bars or `overflow: hidden` is lost to them entirely.

## Fix

Test at a 320 CSS px wide viewport (and 256 px tall for horizontal scripts): nothing may need horizontal scrolling except parts that need two dimensions (data tables as a whole, maps, diagrams, video, code). Fix with fluid widths, wrapping flex and grid, `min-width: 0` on flex children, `overflow-wrap: anywhere` for long strings, and smaller sticky headers on short screens.

## Examples

```js
// In DevTools at 320 px wide: list the elements wider than the page
[...document.querySelectorAll('body *')].filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth)
```
