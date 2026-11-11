---
id: security/sri-cdn
title: Versioned files from a public CDN carry Subresource Integrity (integrity plus crossorigin), or are self-hosted.
severity: moderate
check: static
applies:
  - html
  - vue
  - svelte
  - astro
  - jsx
skill: fe-security
since: 0.1.0
sources:
  - title: MDN, Subresource Integrity
    url: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity
  - title: W3C, Subresource Integrity
    url: https://www.w3.org/TR/SRI/
---

## Why

A script from a CDN runs with the full rights of your page. If the CDN or the package is compromised, every site that loads the file runs the attacker's code. With an `integrity` hash, the browser refuses a file that changed.

## Fix

Add `integrity="sha384-…"` (the hash the CDN or `openssl dgst -sha384 -binary file | openssl base64 -A` gives) and `crossorigin="anonymous"`. Better: install the package and let the build bundle it, so it is served from your origin. URLs without a fixed version (tag managers, `latest`) cannot use SRI; keep them to a minimum.

## Examples

```html
<!-- bad -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<!-- good -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha384-…" crossorigin="anonymous"></script>
```
