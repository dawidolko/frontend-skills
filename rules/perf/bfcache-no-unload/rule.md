---
id: perf/bfcache-no-unload
title: No code listens to the unload event; use pagehide or visibilitychange so the page can use the back/forward cache.
severity: moderate
check: static
applies:
  - html
  - vue
  - svelte
  - astro
  - jsx
lighthouse:
  - bf-cache
skill: fe-core-web-vitals
since: 0.1.0
sources:
  - title: web.dev, Back/forward cache (never use the unload event)
    url: https://web.dev/articles/bfcache
  - title: Chrome for Developers, Deprecating the unload event
    url: https://developer.chrome.com/docs/web-platform/deprecating-unload
  - title: MDN, Window pagehide event
    url: https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event
---

## Why

With the back/forward cache, going back shows the page instantly with LCP, CLS and INP of a cached page. An `unload` listener makes Firefox skip the cache and Chrome is phasing the event out; `unload` also does not fire reliably on mobile, so the code it guards is lost anyway.

## Fix

Move the work to `pagehide` (fires on every navigation away, cache or not) or to `visibilitychange` when `document.visibilityState === 'hidden'` (the last reliable moment on mobile). Send analytics with `navigator.sendBeacon` or `fetch(…, { keepalive: true })`. Check third-party scripts too: DevTools > Application > Back/forward cache lists what blocks it.

## Examples

```js
// bad
window.addEventListener('unload', sendStats)
// good
window.addEventListener('pagehide', sendStats)
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveDraft() })
```
