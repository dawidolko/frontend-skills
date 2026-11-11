---
id: perf/srcset-sizes
title: A srcset with width descriptors (400w, 800w) comes with a sizes attribute that matches the image's displayed width.
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
  - image-delivery-insight
skill: fe-images
since: 0.1.0
sources:
  - title: HTML Standard, srcset and sizes attributes
    url: https://html.spec.whatwg.org/multipage/images.html#srcset-attributes
  - title: MDN, Responsive images
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images
  - title: web.dev, Learn Responsive Design, Responsive images
    url: https://web.dev/learn/design/responsive-images
---

## Why

With width descriptors the browser picks a file from the width the image will be shown at, and `sizes` is how it knows that width before the CSS is ready. Without `sizes` it assumes the full viewport width, so a card shown at a third of the screen downloads the largest file on every device. Mixing `w` and `x` descriptors in one `srcset` is invalid.

## Fix

Add `sizes` describing the rendered width at each layout: `sizes="(width >= 60rem) 33vw, 100vw"`. Use `x` descriptors only for fixed-size images such as logos and icons. Framework image components take `sizes` as a prop (`next/image`, `NuxtImg`, `NgOptimizedImage`).

## Examples

```html
<!-- bad -->
<img src="card-800.jpg" srcset="card-400.jpg 400w, card-800.jpg 800w" alt="Product" width="800" height="600">
<!-- good -->
<img src="card-800.jpg" srcset="card-400.jpg 400w, card-800.jpg 800w" sizes="(width >= 60rem) 33vw, 100vw" alt="Product" width="800" height="600">
```
