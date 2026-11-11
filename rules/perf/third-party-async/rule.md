---
id: perf/third-party-async
title: Third-party scripts load with async or defer (or a framework strategy such as lazyOnload), never as parser-blocking tags.
severity: moderate
check: static
applies:
  - html
  - vue
  - svelte
  - astro
  - jsx
skill: fe-perf-delivery
since: 0.1.0
sources:
  - title: web.dev, Efficiently load third-party JavaScript
    url: https://web.dev/articles/efficiently-load-third-party-javascript
  - title: MDN, the script element (async and defer)
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script
  - title: Next.js, Script component (strategy)
    url: https://nextjs.org/docs/app/api-reference/components/script
---

## Why

A plain `<script src>` stops HTML parsing until a server you do not control answers and the script runs. A slow chat widget or tag manager then delays everything after it, and an outage of that server can leave the page half-rendered.

## Fix

Add `async` to independent tags (analytics, chat), `defer` when order matters, or load the script after an interaction. In frameworks use the loader: Next.js `<Script strategy="afterInteractive">` or `"lazyOnload"`, Nuxt `useScript`, Astro `<script>` processing. Ask whether the third party is needed on this page at all.

## Examples

```html
<!-- bad -->
<script src="https://widget.example-chat.com/loader.js"></script>
<!-- good -->
<script src="https://widget.example-chat.com/loader.js" async></script>
```
