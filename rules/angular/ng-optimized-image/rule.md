---
id: angular/ng-optimized-image
title: Static images in Angular templates use NgOptimizedImage (ngSrc with width and height, or fill), not a plain src.
severity: moderate
check: static
applies:
  - angular
stack:
  - angular
skill: fe-angular
since: 0.1.0
sources:
  - title: Angular, Getting started with NgOptimizedImage
    url: https://angular.dev/guide/image-optimization
  - title: Angular API, NgOptimizedImage
    url: https://angular.dev/api/common/NgOptimizedImage
---

## Why

A plain `<img src>` gets none of the help Angular offers: `ngSrc` requires `width` and `height` (or `fill`), so the space is reserved and the layout does not shift; it lazy-loads below-the-fold images, builds `srcset` through an image loader, and in development warns when the LCP image is not marked `priority` or an image is distorted.

## Fix

Import `NgOptimizedImage` in the component, replace `src` with `ngSrc`, and give `width` and `height` (the intrinsic size) or `fill` inside a positioned parent. Add `priority` to the main image above the fold and `sizes` to responsive images. Inline base64 images and CSS backgrounds are not supported; leave those as they are.

## Examples

```html
<!-- bad -->
<img src="/images/hero.jpg" alt="Harbour at dawn">
<!-- good -->
<img ngSrc="/images/hero.jpg" width="1200" height="600" priority alt="Harbour at dawn">
```
