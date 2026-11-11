---
id: a11y/no-meta-refresh
title: No meta refresh reloads or redirects the page after a delay; redirect on the server or let people choose.
severity: serious
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
wcag:
  - 2.2.1
level: A
axe:
  - meta-refresh
lighthouse:
  - meta-refresh
skill: fe-a11y-core
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 2.2.1 Timing Adjustable
    url: https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html
  - title: WCAG 2.2 Failure F41, using meta refresh to reload the page
    url: https://www.w3.org/WAI/WCAG22/Techniques/failures/F41
---

## Why

A timed refresh moves the page away while someone is still reading it or filling it in, and sends screen reader users back to the top. People who read slowly lose their place every time.

## Fix

Redirect with an HTTP 301 or 308 from the server (or an instant `content="0; url=…"` where the host allows nothing else). For live data, update the part that changes with script and a polite live region, and offer a pause.

## Examples

```html
<!-- bad -->
<meta http-equiv="refresh" content="30">
<!-- good: a server redirect, or a link the person follows -->
<p>This page has moved to <a href="/new">the new address</a>.</p>
```
