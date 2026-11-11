---
id: perf/lcp-image-priority
title: The image that is likely the LCP element loads eagerly with fetchpriority high; it is never lazy-loaded.
severity: serious
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
lighthouse:
  - lcp-discovery-insight
skill: fe-images
since: 0.1.0
sources:
  - title: web.dev, Optimize Largest Contentful Paint
    url: https://web.dev/articles/optimize-lcp
  - title: web.dev, Optimize resource loading with the Fetch Priority API
    url: https://web.dev/articles/fetch-priority
  - title: web.dev, Browser-level image lazy loading
    url: https://web.dev/articles/browser-level-image-lazy-loading
  - title: Chrome for Developers, LCP request discovery insight
    url: https://developer.chrome.com/docs/performance/insights/lcp-discovery
  - title: Next.js, Image component (preload, fetchPriority, loading)
    url: https://nextjs.org/docs/app/api-reference/components/image
---

## Why

The hero image is usually the largest thing in the first view, so its load time is the page's Largest Contentful Paint. `loading="lazy"` makes the browser wait until layout to know whether the image is in view, which adds a delay to exactly the request that matters most. Marking it `fetchpriority="high"` and lazy at once cancels the hint.

## Fix

Remove `loading="lazy"` from the hero and the first images in view, and give the one LCP image `fetchpriority="high"` (Next.js 16: `<Image fetchPriority="high">` or `loading="eager"`, since `next/image` is lazy by default and `priority` is deprecated in favour of `preload`; Angular `<img ngSrc priority>`, Nuxt `<NuxtImg :preload="{ fetchPriority: 'high' }">`). Keep `loading="lazy"` for images further down. Confirm which element is the LCP with `audit --url` or the DevTools Performance panel.

## Examples

```html
<!-- bad -->
<img src="hero.avif" alt="Autumn collection" width="1600" height="900" loading="lazy">
<!-- good -->
<img src="hero.avif" alt="Autumn collection" width="1600" height="900" fetchpriority="high">
```
