---
id: seo/og-absolute-url
title: Open Graph and social image and URL tags (og:image, og:url, twitter:image) use absolute https URLs.
severity: minor
check: static
applies:
  - html
  - vue
  - svelte
  - astro
  - jsx
skill: fe-seo-metadata
since: 0.1.0
sources:
  - title: The Open Graph protocol
    url: https://ogp.me/
---

## Why

Link previews in chat apps and social networks are built by crawlers that read only these tags. A relative image path is not resolved, so the shared link appears without an image or with a broken one.

## Fix

Build the URL from the site's configured origin: `new URL('/img/share.png', site).href`. Use a 1200 × 630 image or larger, add `og:image:alt`, and keep these tags in the server-rendered HTML, not added by client script.

## Examples

```html
<!-- bad -->
<meta property="og:image" content="/img/share.png">
<!-- good -->
<meta property="og:image" content="https://example.com/img/share.png">
<meta property="og:image:alt" content="Acme dashboard showing the weekly report">
```
