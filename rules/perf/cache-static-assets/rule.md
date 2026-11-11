---
id: perf/cache-static-assets
title: Content-hashed assets are cached for a year as immutable; HTML is revalidated (no-cache), never cached long.
severity: moderate
check: browser
applies:
  - page
lighthouse:
  - cache-insight
skill: fe-perf-delivery
since: 0.1.0
sources:
  - title: web.dev, Prevent unnecessary network requests with the HTTP Cache
    url: https://web.dev/articles/http-cache
  - title: MDN, Cache-Control
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control
  - title: Chrome for Developers, Use efficient cache lifetimes insight
    url: https://developer.chrome.com/docs/performance/insights/cache
---

## Why

Without long cache lifetimes, returning visitors download the same scripts, styles, fonts and images again. With long lifetimes on HTML or on files whose names do not change, visitors keep seeing an old version after a deploy.

## Fix

Let the build add a content hash to file names (Vite, webpack and the frameworks do it by default) and serve those with `Cache-Control: public, max-age=31536000, immutable`. Serve HTML with `Cache-Control: no-cache` so it is revalidated each time. Configure it in the host's headers file (`_headers`, `vercel.json`, `netlify.toml`, server config).

## Examples

```text
# _headers (Netlify, Cloudflare Pages)
/assets/*
  Cache-Control: public, max-age=31536000, immutable
/*.html
  Cache-Control: no-cache
```
