---
id: js/passive-listeners
title: Mark touchstart, touchmove and wheel listeners { passive true } unless the handler really calls preventDefault().
severity: moderate
check: static
applies:
  - jsx
  - html
  - vue
  - svelte
  - astro
skill: fe-javascript
since: 0.1.0
sources:
  - title: MDN, EventTarget.addEventListener() (improving scroll performance with passive listeners)
    url: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
---

## Why

For a touch or wheel listener that may call `preventDefault()`, the browser has to wait for the handler before it scrolls. On an element (anything other than `window`, `document` or `body`, which are passive by default) that wait makes scrolling stutter on phones, most of all while the main thread is busy.

## Fix

Pass `{ passive: true }` as the third argument when the handler only reads the event. When it must block scrolling (a custom drag), pass `{ passive: false }` explicitly so the intent is visible, and prefer CSS `touch-action` or `overscroll-behavior` where they can do the job.

## Examples

```js
// bad
slider.addEventListener('touchmove', (event) => track(event.touches[0].clientX))
// good
slider.addEventListener('touchmove', (event) => track(event.touches[0].clientX), { passive: true })
```
