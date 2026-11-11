---
id: a11y/reflow
title: At 320 CSS pixels wide (400% zoom) content reflows into one column with no horizontal scrolling, except tables, maps and similar.
severity: serious
check: manual
applies:
  - css
  - scss
  - less
  - page
wcag:
  - 1.4.10
level: AA
skill: fe-a11y-visual
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 1.4.10 Reflow
    url: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
  - title: WCAG 2.2 Technique C32, using media queries and grid CSS to reflow columns
    url: https://www.w3.org/WAI/WCAG22/Techniques/css/C32
---

## Why

People who zoom to 400% on a laptop see a 320px-wide page. If they must scroll sideways for every line, reading becomes a two-axis search and they lose their place.

## Fix

Build layouts that wrap: `flex-wrap`, `grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr))`, `max-width` instead of `width`, `overflow-wrap: anywhere` for long words and URLs. Data tables, maps, diagrams and code may scroll inside their own container (`fe-a11y-tables`). Test at 320px width or 400% zoom.

## Examples

```css
/* bad */
.cards { display: grid; grid-template-columns: repeat(3, 300px); }
/* good */
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr)); }
```
