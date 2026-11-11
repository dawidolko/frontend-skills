---
id: next/use-next-image
title: In a Next.js app, render images with next/image instead of a plain img element (a picture element with its own sources is fine).
severity: moderate
check: static
applies:
  - jsx
stack:
  - next
skill: fe-nextjs
since: 0.1.0
sources:
  - title: Next.js docs, No img element (ESLint message and ways to fix)
    url: https://nextjs.org/docs/messages/no-img-element
  - title: Next.js docs, Image component
    url: https://nextjs.org/docs/app/api-reference/components/image
---

## Why

A plain `<img>` ships the original file at its full size and format to every screen. `next/image` serves a resized AVIF or WebP from a generated `srcset`, lazy-loads below the fold and reserves the image's space, so the Largest Contentful Paint comes sooner and nothing shifts while it loads.

## Fix

`import Image from 'next/image'` and pass `src`, `alt`, and `width`/`height` (or a static import, which gives them for free; or `fill` with `sizes`). Remote images need a matching `images.remotePatterns` entry in `next.config`. Keep a plain `<img>` inside a `<picture>` with your own `<source>` elements, in `opengraph-image`/`icon` files rendered by `ImageResponse`, or mark the line with `fs-ignore next/use-next-image` and a reason.

## Examples

```jsx
// bad
<img src="/team.jpg" alt="The team at the 2026 retreat" />
// good
import team from './team.jpg'
<Image src={team} alt="The team at the 2026 retreat" placeholder="blur" />
```
