---
id: perf/font-fallback-metrics
title: The fallback font is adjusted to the web font's metrics (size-adjust and overrides) so the swap does not shift the layout.
severity: minor
check: manual
applies:
  - css
  - scss
  - less
skill: fe-fonts
since: 0.1.0
sources:
  - title: web.dev, Optimize Cumulative Layout Shift (web fonts)
    url: https://web.dev/articles/optimize-cls
  - title: MDN, size-adjust descriptor
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust
  - title: Next.js, Font optimization (adjustFontFallback)
    url: https://nextjs.org/docs/app/api-reference/components/font
---

## Why

With `font-display: swap` the page first renders in the fallback font and re-renders when the web font arrives. If the two fonts have different widths and line heights, every line rewraps and everything below moves, which shows up as layout shift (CLS).

## Fix

Define a fallback `@font-face` on a local font with `size-adjust` (and `ascent-override`, `descent-override`, `line-gap-override` where supported) tuned to the web font, and list it right after the web font in `font-family`. `next/font` (`adjustFontFallback`) and `@nuxt/fonts` generate this for you. Check that the overrides are supported in the browsers you target; `size-adjust` is the widely supported one.

## Examples

```css
@font-face { font-family: "Inter Fallback"; src: local("Arial"); size-adjust: 107%; ascent-override: 90%; }
body { font-family: Inter, "Inter Fallback", system-ui, sans-serif; }
```
