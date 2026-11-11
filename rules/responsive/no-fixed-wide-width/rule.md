---
id: responsive/no-fixed-wide-width
title: No layout box gets a fixed width wider than 320 CSS px; cap it with max-width or min(100%, …) so the page reflows on narrow screens.
severity: serious
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
  - 1.4.10
level: AA
skill: fe-responsive
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 1.4.10 Reflow
    url: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
  - title: W3Schools, Responsive Web Design, the viewport (avoid large fixed widths)
    url: https://www.w3schools.com/css/css_rwd_viewport.asp
  - title: MDN, min()
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/min
---

## Why

A box with `width: 960px` or `min-width: 500px` stays that wide on a phone and at 400% zoom (a 1280px window zoomed four times is 320 CSS px), so every line has to be scrolled sideways to be read. Reflow (WCAG 1.4.10) asks that content fits 320 CSS px without two-dimensional scrolling, apart from things like data tables and maps.

## Fix

Use `max-width` for the limit and let the box shrink: `max-width: 60rem; margin-inline: auto`, or `width: min(100%, 40rem)`. Put a wide fixed size inside a `@media (min-width: …)` or `@container` query where there is room. Data tables and code blocks scroll inside their own wrapper.

## Examples

```css
/* bad */
.wrapper { width: 960px; }
/* good */
.wrapper { max-width: 60rem; margin-inline: auto; padding-inline: 1rem; }
```
