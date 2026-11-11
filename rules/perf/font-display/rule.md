---
id: perf/font-display
title: Every @font-face and Google Fonts URL sets font-display (swap or optional) so text is visible while the font loads.
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
lighthouse:
  - font-display-insight
skill: fe-fonts
since: 0.1.0
sources:
  - title: MDN, the font-display descriptor
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display
  - title: Chrome for Developers, Ensure text remains visible during webfont load
    url: https://developer.chrome.com/docs/lighthouse/performance/font-display
  - title: web.dev, Best practices for fonts
    url: https://web.dev/articles/font-best-practices
---

## Why

Without `font-display`, browsers may hide text for up to a few seconds while a web font downloads, so the page looks empty and the Largest Contentful Paint can wait for the font.

## Fix

Add `font-display: swap` to show fallback text at once, or `font-display: optional` when you would rather keep the fallback than shift the layout. Pick a fallback with similar metrics, or adjust it with `size-adjust`. For Google Fonts, add `&display=swap` to the stylesheet URL.

## Examples

```css
/* bad */
@font-face { font-family: Inter; src: url(/inter.woff2) format("woff2"); }
/* good */
@font-face { font-family: Inter; src: url(/inter.woff2) format("woff2"); font-display: swap; }
```
