---
id: perf/font-preconnect
title: Fonts are self-hosted, or the font CDN's file origin (fonts.gstatic.com) is preconnected with crossorigin.
severity: minor
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
skill: fe-fonts
since: 0.1.0
sources:
  - title: web.dev, Best practices for fonts (preconnect and self-hosting)
    url: https://web.dev/articles/font-best-practices
  - title: MDN, rel=preconnect
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preconnect
---

## Why

With Google Fonts the stylesheet comes from `fonts.googleapis.com` but the font files from `fonts.gstatic.com`, which the browser discovers only after the CSS arrives. Each new origin costs a DNS lookup, a connection and TLS before the first byte of the font, delaying the text. A preconnect without `crossorigin` opens the wrong kind of connection for fonts.

## Fix

Prefer self-hosting the fonts from your own origin (`next/font` and `@nuxt/fonts` do it at build time). If you keep the CDN, add `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` before the stylesheet and `&display=swap` to its URL.

## Examples

```html
<!-- bad -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&display=swap">
<!-- good -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&display=swap">
```
