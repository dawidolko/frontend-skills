---
id: responsive/dynamic-viewport-units
title: A full-height layout uses 100dvh (or svh) instead of 100vh, which is taller than the visible area on mobile.
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
  - jsx
  - angular
skill: fe-responsive
since: 0.1.0
sources:
  - title: web.dev, The large, small, and dynamic viewport units
    url: https://web.dev/blog/viewport-units
  - title: MDN, CSS length units (viewport units)
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/length
  - title: Tailwind CSS, height (h-dvh and h-svh)
    url: https://tailwindcss.com/docs/height
---

## Why

On mobile browsers `100vh` equals the viewport with the address bar hidden, so a full-height hero or a sticky footer is cut off or jumps when the bar shows.

## Fix

Use `min-height: 100dvh` (follows the visible area) or `100svh` (the smallest, stable value). Keep a `100vh` line before it only if you support browsers without the new units. With Tailwind, use `min-h-dvh` or `min-h-svh` instead of `min-h-screen`.

## Examples

```css
/* bad */
.hero { min-height: 100vh; }
/* good */
.hero { min-height: 100svh; }
```
