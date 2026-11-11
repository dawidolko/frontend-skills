---
id: security/csp-meta-ignored
title: frame-ancestors, report-uri, sandbox and X-Frame-Options are sent as HTTP headers; in a meta tag they do nothing.
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
  - title: MDN, Content-Security-Policy frame-ancestors (not supported in meta)
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors
  - title: W3C, Content Security Policy Level 3 (delivery via meta element)
    url: https://www.w3.org/TR/CSP3/#meta-element
---

## Why

Browsers ignore these settings when they come from a `<meta>` tag, so the page looks protected in the source but can still be framed by any site (clickjacking) and violations are never reported.

## Fix

Send `Content-Security-Policy` (with `frame-ancestors 'none'` or `'self'`) and, for old browsers, `X-Frame-Options: DENY` as response headers from the server or the host's headers file. A meta CSP is fine for the directives it supports (`script-src`, `default-src`, `object-src`, `base-uri`), placed early in `<head>`.

## Examples

```text
# _headers
/*
  Content-Security-Policy: default-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'none'
  X-Frame-Options: DENY
```
