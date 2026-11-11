---
id: perf/img-modern-format
title: Photos and large raster images are served as AVIF or WebP at the size they are shown, not as large JPEG or PNG files.
severity: moderate
check: browser
applies:
  - page
lighthouse:
  - image-delivery-insight
skill: fe-images
since: 0.1.0
sources:
  - title: Chrome for Developers, Image delivery insight
    url: https://developer.chrome.com/docs/performance/insights/image-delivery
  - title: web.dev, Choose the right image format
    url: https://web.dev/articles/choose-the-right-image-format
  - title: MDN, Image file type and format guide
    url: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types
---

## Why

Images are usually the heaviest part of a page. AVIF and WebP store the same photo in far fewer bytes than JPEG or PNG, and an image delivered larger than it is displayed wastes the difference on every visit. Both slow the Largest Contentful Paint and cost data on mobile.

## Fix

Encode photos as AVIF (with WebP or JPEG fallback in `<picture>` if older browsers matter) and size them to the largest rendered width, with `srcset` and `sizes` for the others. Let the framework do it where it can: `next/image`, `@nuxt/image`, Astro's `<Image>`, Angular `NgOptimizedImage` with a loader, SvelteKit `enhanced:img`. Keep PNG for screenshots with sharp edges if AVIF looks worse, and SVG for logos and icons.

## Examples

```html
<!-- bad: a 2400 px JPEG shown at 800 px -->
<img src="hero.jpg" alt="Autumn collection" width="800" height="450">
<!-- good -->
<picture>
  <source type="image/avif" srcset="hero-800.avif 800w, hero-1600.avif 1600w" sizes="(width >= 60rem) 50vw, 100vw">
  <img src="hero-800.jpg" alt="Autumn collection" width="800" height="450">
</picture>
```
