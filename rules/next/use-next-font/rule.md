---
id: next/use-next-font
title: Load web fonts with next/font (google or local), not a link or @import to the Google Fonts stylesheet.
severity: moderate
check: static
applies:
  - jsx
  - css
  - scss
stack:
  - next
skill: fe-nextjs
since: 0.1.0
sources:
  - title: Next.js docs, Font module (next/font)
    url: https://nextjs.org/docs/app/api-reference/components/font
  - title: Next.js docs, ESLint plugin (no-page-custom-font, google-font-display)
    url: https://nextjs.org/docs/app/api-reference/config/eslint
---

## Why

A `<link>` or `@import` to `fonts.googleapis.com` makes every visitor's browser connect to two more origins before text can render in the font, sends their IP address to Google, and swaps fonts with a visible layout shift. `next/font` downloads the files at build time, serves them from your own domain, preloads them and generates a size-matched fallback.

## Fix

`import { Inter } from 'next/font/google'`, call it once at module level (`const inter = Inter({ subsets: ['latin'], display: 'swap' })`) in the root layout or a shared `fonts.ts`, and apply `inter.className` or its `variable` on `<html>`. For your own files, `next/font/local` with `src: './fonts/brand.woff2'`. Remove the `<link>` tags and the `@import`.

## Examples

```jsx
// bad
<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
// good
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })
<html lang="en" className={inter.variable}>
```
