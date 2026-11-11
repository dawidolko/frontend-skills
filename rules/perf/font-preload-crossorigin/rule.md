---
id: perf/font-preload-crossorigin
title: A font preload has crossorigin (and type font/woff2); without it the preload is wasted and the font is fetched twice.
severity: moderate
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
skill: fe-fonts
since: 0.1.0
sources:
  - title: MDN, rel=preload (CORS-enabled fetches)
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload
  - title: web.dev, Best practices for fonts (preload)
    url: https://web.dev/articles/font-best-practices
---

## Why

Browsers always fetch fonts in CORS mode, even from your own origin. A `<link rel="preload" as="font">` without `crossorigin` is a non-CORS request, so it does not match: the browser downloads the font a second time when the CSS asks for it, and the preload only stole bandwidth.

## Fix

Add `crossorigin` (anonymous) and `type="font/woff2"`: `<link rel="preload" href="/fonts/brand.woff2" as="font" type="font/woff2" crossorigin>`. Preload only the one or two fonts used in the first view; frameworks such as `next/font` and `@nuxt/fonts` write the tag for you.

## Examples

```html
<!-- bad -->
<link rel="preload" href="/fonts/brand.woff2" as="font" type="font/woff2">
<!-- good -->
<link rel="preload" href="/fonts/brand.woff2" as="font" type="font/woff2" crossorigin>
```
