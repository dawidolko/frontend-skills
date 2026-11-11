---
id: js/listener-cleanup
title: Listeners, timers and observers a view starts are removed when it goes away; one AbortController signal can end them all.
severity: moderate
check: manual
applies:
  - jsx
  - vue
  - svelte
  - astro
  - html
skill: fe-javascript
since: 0.1.0
sources:
  - title: MDN, EventTarget.addEventListener() (the signal option)
    url: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
  - title: MDN, AbortController
    url: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
---

## Why

In a single-page app, a view that adds a `resize` listener, a `setInterval` or an `IntersectionObserver` and never removes it keeps running after navigation: memory grows, handlers fire twice after the view comes back, and they act on elements that no longer exist.

## Fix

Create one `AbortController` per view or component, pass `{ signal }` to every `addEventListener` and to `fetch`, and call `abort()` on teardown (the effect cleanup, `onUnmounted`, `disconnectedCallback`, `DestroyRef.onDestroy`). Clear timers with `clearInterval` and call `disconnect()` on observers in the same place.

## Examples

```js
// bad
connectedCallback() { window.addEventListener('resize', this.layout) }
// good
connectedCallback() {
  this.controller = new AbortController()
  window.addEventListener('resize', this.layout, { signal: this.controller.signal })
}
disconnectedCallback() { this.controller.abort() }
```
