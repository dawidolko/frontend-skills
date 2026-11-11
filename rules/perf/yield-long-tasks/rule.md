---
id: perf/yield-long-tasks
title: Main-thread work over 50 ms is split and yields, and event handlers do the visible update first (INP 200 ms or less).
severity: moderate
check: manual
applies:
  - jsx
  - vue
  - svelte
  - astro
  - html
skill: fe-core-web-vitals
since: 0.1.0
sources:
  - title: web.dev, Interaction to Next Paint
    url: https://web.dev/articles/inp
  - title: web.dev, Optimize long tasks
    url: https://web.dev/articles/optimize-long-tasks
  - title: MDN, Scheduler yield() method
    url: https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield
---

## Why

While a long task runs, the page cannot paint the result of a click or key press. INP measures that delay for the slowest interactions; "good" is 200 ms or less at the 75th percentile. Big re-renders, JSON parsing, analytics and validation inside a handler are the usual causes.

## Fix

In a handler, update the UI first, then yield and do the rest (saving, analytics, recalculation). Split loops over large data into chunks and yield between them with `scheduler.yield()` where it exists and a `setTimeout` fallback. Move pure computation to a Web Worker. Measure with the DevTools Performance panel and the `web-vitals` attribution build.

## Examples

```js
const yieldToMain = () => (globalThis.scheduler?.yield ? scheduler.yield() : new Promise((r) => setTimeout(r, 0)))
button.addEventListener('click', async () => {
  showSpinner()          // visible update first
  await yieldToMain()
  await saveAndTrack()   // the rest after the next paint
})
```
