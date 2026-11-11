---
id: responsive/no-viewport-font-size
title: Text is never sized with viewport units alone (font-size 5vw); fluid type mixes in rem, as in clamp(1rem, 0.9rem + 1vw, 1.5rem).
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
  - 1.4.4
level: AA
skill: fe-responsive
since: 0.1.0
sources:
  - title: WCAG 2.2, Failure F94 (incorrect use of viewport units to resize text)
    url: https://www.w3.org/WAI/WCAG22/Techniques/failures/F94
  - title: WCAG 2.2, Understanding SC 1.4.4 Resize Text
    url: https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
  - title: web.dev, Baseline in action, fluid type
    url: https://web.dev/articles/baseline-in-action-fluid-type
---

## Why

Viewport units follow the window, not the zoom level or the browser's text size. Text set to `5vw` stays the same size when someone zooms in, so it may never reach the 200% that low-vision readers need.

## Fix

Mix a `rem` part into the formula and bound it with `rem`: `font-size: clamp(1.75rem, 1.2rem + 2vw, 3rem)`. Keep the maximum no more than about 2.5 times the minimum so zoom can still double the text. Check at 200% zoom.

## Examples

```css
/* bad */
.hero__title { font-size: 6vw; }
/* good */
.hero__title { font-size: clamp(2rem, 1.2rem + 4vw, 4rem); }
```
