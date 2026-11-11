---
id: seo/indexable
title: Pages meant to rank are crawlable and carry no noindex (meta robots or X-Robots-Tag) in production.
severity: serious
check: browser
applies:
  - page
lighthouse:
  - is-crawlable
skill: fe-seo-metadata
since: 0.1.0
sources:
  - title: Chrome for Developers, Page is blocked from indexing (Lighthouse audit)
    url: https://developer.chrome.com/docs/lighthouse/seo/is-crawlable
  - title: MDN, X-Robots-Tag header
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Robots-Tag
---

## Why

A `noindex` left over from a staging build, or a robots.txt that blocks the site, removes pages from search results entirely. It is the single heaviest SEO audit in Lighthouse, because nothing else matters if the page cannot be indexed.

## Fix

Set robots meta per environment from configuration (`noindex` only on preview and staging), keep it in the server HTML (not toggled by script), and keep `noindex` only on pages that should not appear (search results, cart, account). A page you want removed must stay crawlable so the `noindex` is seen; do not also block it in robots.txt.

## Examples

```html
<!-- staging only -->
<meta name="robots" content="noindex, nofollow">
```
