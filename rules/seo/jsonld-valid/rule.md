---
id: seo/jsonld-valid
title: Every JSON-LD block is valid JSON with "@context" "https://schema.org" and a schema.org @type.
severity: moderate
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
  - title: Chrome for Developers, Structured data is valid (Lighthouse audit)
    url: https://developer.chrome.com/docs/lighthouse/seo/structured-data
  - title: W3C, JSON-LD 1.1
    url: https://www.w3.org/TR/json-ld11/
---

## Why

A trailing comma or a missing quote makes the whole block invalid, and search engines drop it silently: no rich result, no error anywhere. Lighthouse lists structured data only as a manual check, so nothing in the usual tools catches it.

## Fix

Generate JSON-LD from an object with `JSON.stringify` (escape `<` as `<` when you inject it into HTML), or validate hand-written blocks. Use `"@context": "https://schema.org"` and a type from Google's current search gallery, describe only what is visible on the page, and test with the Rich Results Test.

## Examples

```html
<!-- bad: trailing comma -->
<script type="application/ld+json">{ "@context": "https://schema.org", "@type": "Organization", "name": "Acme", }</script>
<!-- good -->
<script type="application/ld+json">{ "@context": "https://schema.org", "@type": "Organization", "name": "Acme", "url": "https://example.com" }</script>
```
