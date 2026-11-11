---
id: seo/canonical-valid
title: A page has at most one rel="canonical", in the head, with an absolute URL of an indexable page and no fragment.
severity: moderate
check: static
applies:
  - html
  - vue
  - svelte
  - astro
  - jsx
lighthouse:
  - canonical
skill: fe-seo-metadata
since: 0.1.0
sources:
  - title: Google Search Central, How to specify a canonical URL with rel="canonical"
    url: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
---

## Why

The canonical tells search engines which of several URLs with the same content to show (with and without parameters, trailing slash, `www`). Two canonicals, a relative path resolved against the wrong base, or a fragment make search engines ignore the hint and pick one themselves.

## Fix

Emit one `<link rel="canonical" href="https://example.com/path">` per page from the layout, built from the site's configured origin and the clean path (no tracking parameters, no `#`). Point it at a page that returns 200 and is not `noindex`. Keep sitemap URLs equal to canonical URLs.

## Examples

```html
<!-- bad -->
<link rel="canonical" href="/pricing">
<!-- good -->
<link rel="canonical" href="https://example.com/pricing">
```
