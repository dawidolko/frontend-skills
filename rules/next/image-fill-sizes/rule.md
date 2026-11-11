---
id: next/image-fill-sizes
title: A next/image with fill (or sized by CSS) sets sizes, so the browser does not download a viewport-wide file for a small slot.
severity: moderate
check: static
applies:
  - jsx
stack:
  - next
skill: fe-nextjs
since: 0.1.0
sources:
  - title: Next.js docs, Image component (sizes)
    url: https://nextjs.org/docs/app/api-reference/components/image
---

## Why

With `fill`, the image has no width of its own, so Next.js generates a `srcset` for every device width. Without `sizes` the browser assumes the image is as wide as the viewport (`100vw`) and picks a file to match: a card thumbnail 300 px wide downloads a 1,920 px image on a desktop screen, which costs data and delays the Largest Contentful Paint.

## Fix

Describe the rendered width per breakpoint, matching your CSS: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`. Use `sizes="100vw"` only for images that really span the viewport. Give the parent `position: relative` (or `fixed`/`absolute`) and a size.

## Examples

```jsx
// bad
<Image src={product.photo} alt={product.name} fill />
// good
<Image src={product.photo} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" />
```
