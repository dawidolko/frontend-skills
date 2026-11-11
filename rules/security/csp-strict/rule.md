---
id: security/csp-strict
title: Production pages send a strict Content Security Policy (nonces or hashes with strict-dynamic, object-src none, base-uri none).
severity: moderate
check: browser
applies:
  - page
lighthouse:
  - csp-xss
skill: fe-security
since: 0.1.0
sources:
  - title: web.dev, Mitigate cross-site scripting (XSS) with a strict Content Security Policy
    url: https://web.dev/articles/strict-csp
  - title: OWASP Cheat Sheet Series, Content Security Policy
    url: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
  - title: MDN, Content Security Policy
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP
---

## Why

A CSP is the second line of defence against XSS: when an injection slips through, the browser refuses to run script the policy did not allow. Allowlists of domains are easy to bypass; `'unsafe-inline'` and `'unsafe-eval'` switch the protection off.

## Fix

Send `script-src 'nonce-{random}' 'strict-dynamic'; object-src 'none'; base-uri 'none'` with a fresh unguessable nonce per response (server-rendered apps), or hashes of inline scripts for static sites. Roll out with `Content-Security-Policy-Report-Only` first and a reporting endpoint, then enforce. Next.js, Nuxt, SvelteKit and Astro document nonce or hash support; use it instead of hand-writing headers.

## Examples

```text
Content-Security-Policy: script-src 'nonce-r4nd0m' 'strict-dynamic'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'
```
