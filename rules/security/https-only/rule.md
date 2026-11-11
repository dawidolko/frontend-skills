---
id: security/https-only
title: Every page and every resource it loads use HTTPS; no mixed content and no http:// links to your own site.
severity: serious
check: browser
applies:
  - page
lighthouse:
  - is-on-https
skill: fe-security
since: 0.1.0
sources:
  - title: Chrome for Developers, Does not use HTTPS (Lighthouse audit)
    url: https://developer.chrome.com/docs/lighthouse/best-practices/is-on-https
  - title: MDN, Mixed content
    url: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Mixed_content
---

## Why

Without HTTPS anyone on the network can read and change the page, including injecting script. Browsers block or warn about mixed content, so an `http://` image or script on an HTTPS page breaks or degrades it, and many APIs (service workers, geolocation, clipboard) need a secure context.

## Fix

Serve the site only over HTTPS with a redirect from HTTP and an HSTS header, write own-site links as relative or `https://` URLs, and load third-party resources over HTTPS. Search the code for `http://` in `src`, `href` and API base URLs.

## Examples

```html
<!-- bad -->
<img src="http://example.com/logo.png" alt="Acme">
<!-- good -->
<img src="/logo.png" alt="Acme">
```
