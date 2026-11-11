---
id: perf/lcp-image
title: The LCP image is in the initial HTML, not lazy, and has fetchpriority="high"; a CSS background LCP image is preloaded.
severity: moderate
check: browser
applies:
  - page
lighthouse:
  - lcp-discovery-insight
skill: fe-core-web-vitals
since: 0.1.0
sources:
  - title: Chrome for Developers, LCP request discovery insight
    url: https://developer.chrome.com/docs/performance/insights/lcp-discovery
  - title: web.dev, Optimize Largest Contentful Paint
    url: https://web.dev/articles/optimize-lcp
  - title: web.dev, Optimize resource loading with the Fetch Priority API
    url: https://web.dev/articles/fetch-priority
---

## Why

LCP is the moment the largest image or text block appears; "good" is 2.5 s or less at the 75th percentile. When the image URL is only known after JavaScript runs or CSS loads, or the request waits behind others, the browser discovers it late and the delay shows up directly in LCP.

## Fix

Put the hero `<img src srcset sizes>` in the server HTML. Give it `fetchpriority="high"` and no `loading="lazy"`. If it must be a CSS background, add `<link rel="preload" as="image" href="…" fetchpriority="high">` (with `imagesrcset` and `imagesizes` for responsive images). In client-rendered apps, render the hero on the server or prerender the route.

## Examples

```html
<!-- good -->
<img src="hero-1200.avif" srcset="hero-800.avif 800w, hero-1600.avif 1600w" sizes="100vw"
     width="1600" height="900" alt="…" fetchpriority="high">
```
