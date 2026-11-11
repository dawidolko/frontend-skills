---
id: a11y/zoom-not-blocked
title: The viewport never disables zoom (no user-scalable=no, no maximum-scale below 2).
severity: critical
check: static
applies:
  - html
  - astro
  - jsx
  - svelte
  - vue
wcag:
  - 1.4.4
level: AA
axe:
  - meta-viewport
skill: fe-responsive
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 1.4.4 Resize Text
    url: https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
  - title: MDN, the viewport meta tag
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport
---

## Why

People with low vision pinch to zoom. `user-scalable=no` or a small `maximum-scale` stops them on many mobile browsers, and text that cannot reach 200% fails Resize Text.

## Fix

Use `<meta name="viewport" content="width=device-width, initial-scale=1">` and nothing that limits scaling. In Next.js remove `userScalable: false` and `maximumScale` from the exported `viewport`. Fix layout problems that zoom reveals instead of blocking zoom.

## Examples

```html
<!-- bad -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<!-- good -->
<meta name="viewport" content="width=device-width, initial-scale=1">
```
