---
id: seo/http-status
title: Missing pages return 404 or 410, moved pages 301 or 308, and a client-rendered error view is not served with 200.
severity: moderate
check: browser
applies:
  - page
lighthouse:
  - http-status-code
skill: fe-seo-metadata
since: 0.1.0
sources:
  - title: Google Search Central, How HTTP status codes affect Google Search
    url: https://developers.google.com/search/docs/crawling-indexing/http-network-errors
  - title: Google Search Central, JavaScript SEO basics (soft 404 errors in single-page apps)
    url: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
---

## Why

A "Page not found" view returned with status 200 is a soft 404: search engines may index the error page or keep a dead URL in results. Temporary redirects for permanent moves split ranking signals between the old and new URL.

## Fix

Return the real status from the server or the framework (Next.js `notFound()`, Nuxt `createError({ statusCode: 404 })`, SvelteKit `error(404)`, Astro `return new Response(null, { status: 404 })`). In a client-only app, redirect unknown routes to a URL the server answers with 404, or add `<meta name="robots" content="noindex">` to the error view. Use 301 or 308 for permanent moves.

## Examples

```js
// Next.js App Router
import { notFound } from 'next/navigation'
if (!product) notFound()
```
