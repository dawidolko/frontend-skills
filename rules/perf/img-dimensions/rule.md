---
id: perf/img-dimensions
title: Every img has width and height attributes (or a CSS aspect ratio) so the browser reserves its space.
severity: moderate
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
lighthouse:
  - unsized-images
skill: fe-images
since: 0.1.0
sources:
  - title: web.dev, Optimize Cumulative Layout Shift (images without dimensions)
    url: https://web.dev/articles/optimize-cls
  - title: MDN, the img element (width and height)
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img
---

## Why

An image without dimensions takes no space until it loads, then pushes the content below it down. That shift counts against Cumulative Layout Shift, one of the Core Web Vitals, and makes people click the wrong thing.

## Fix

Write the image's intrinsic size: `<img src="hero.jpg" width="1200" height="600" alt="…">`, and let CSS scale it with `max-width: 100%; height: auto;`. The browser derives the aspect ratio from the two attributes. Framework image components (`next/image`, `@nuxt/image`, `astro:assets`) do this when you pass the size.

## Examples

```html
<!-- bad -->
<img src="hero.jpg" alt="Our team">
<!-- good -->
<img src="hero.jpg" width="1200" height="600" alt="Our team">
```
