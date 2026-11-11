---
id: seo/hreflang-valid
title: hreflang values are ISO 639-1 language codes with an optional script and ISO 3166-1 region (or x-default), linking absolute URLs.
severity: moderate
check: static
applies:
  - html
  - vue
  - svelte
  - astro
  - jsx
lighthouse:
  - hreflang
skill: fe-seo-metadata
since: 0.1.0
sources:
  - title: Chrome for Developers, Document doesn't have a valid hreflang (Lighthouse audit)
    url: https://developer.chrome.com/docs/lighthouse/seo/hreflang
  - title: W3C Internationalization, Language tags in HTML and XML
    url: https://www.w3.org/International/articles/language-tags/
---

## Why

Search engines use hreflang to show each person the version in their language. Locale codes from code (`en_US`), made-up regions (`en-UK`) and relative links make the annotation invalid, so the wrong language version ranks or versions compete with each other.

## Fix

Write the language first, then an optional region, joined with a hyphen: `en`, `en-GB`, `pt-BR`, `zh-Hant`. Use absolute URLs, list every version on every version including itself, and add `x-default` for the language picker or auto-redirect page. Generate the set from the i18n configuration so it stays reciprocal.

## Examples

```html
<!-- bad -->
<link rel="alternate" hreflang="en_UK" href="/en/">
<!-- good -->
<link rel="alternate" hreflang="en-GB" href="https://example.com/en-gb/">
<link rel="alternate" hreflang="x-default" href="https://example.com/">
```
