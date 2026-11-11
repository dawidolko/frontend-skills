---
id: perf/lcp-image-not-lazy
title: The image most likely to be the Largest Contentful Paint (hero, high priority) is never loading="lazy".
severity: moderate
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
skill: fe-core-web-vitals
since: 0.1.0
sources:
  - title: web.dev, Optimize Largest Contentful Paint
    url: https://web.dev/articles/optimize-lcp
  - title: web.dev, Browser-level image lazy loading (avoid lazy loading images in the first visible viewport)
    url: https://web.dev/articles/browser-level-image-lazy-loading
  - title: Chrome for Developers, LCP request discovery insight
    url: https://developer.chrome.com/docs/performance/insights/lcp-discovery
---

## Why

A lazy image is requested only after layout shows it is in the viewport, so the largest image on screen starts downloading late and LCP rises by hundreds of milliseconds, often past the 2.5 s "good" line. Copying `loading="lazy"` onto every image is the usual cause.

## Fix

Remove `loading="lazy"` from the hero or first large image and add `fetchpriority="high"` (one or two images per page at most). Keep `loading="lazy"` for images further down. In frameworks: Next.js `<Image preload>` or `fetchPriority="high"` (`priority` is deprecated in Next.js 16), Angular `ngSrc` with `priority`, Nuxt `<NuxtImg preload>`.

## Examples

```html
<!-- bad -->
<img class="hero" src="hero.avif" alt="…" width="1600" height="900" loading="lazy">
<!-- good -->
<img class="hero" src="hero.avif" alt="…" width="1600" height="900" fetchpriority="high">
```
