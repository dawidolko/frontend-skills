---
id: perf/code-split
title: JavaScript is split by route, and features that most visits do not use load on demand with dynamic import().
severity: moderate
check: browser
applies:
  - page
lighthouse:
  - unused-javascript
skill: fe-perf-delivery
since: 0.1.0
sources:
  - title: web.dev, Reduce JavaScript payloads with code splitting
    url: https://web.dev/articles/reduce-javascript-payloads-with-code-splitting
  - title: MDN, import() (dynamic import)
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
---

## Why

Every kilobyte of JavaScript is downloaded, parsed and compiled before it helps, and the main thread is busy meanwhile: on mid-range phones that shows up as slow LCP and poor INP. A single bundle that holds the editor, the charts and the admin pages makes every visitor pay for all of them.

## Fix

Let the framework split by route (Next.js, Nuxt, SvelteKit, Angular and Astro do it by default; React Router with `lazy`). Load heavy, rarely used parts on demand: `const { Chart } = await import('./chart.js')` on first open, `React.lazy`, Vue `defineAsyncComponent`, Angular `@defer`, Astro `client:visible`. Check the result with a bundle visualiser.

## Examples

```js
// good: the editor loads when someone opens it
openButton.addEventListener('click', async () => {
  const { mountEditor } = await import('./editor.js')
  mountEditor(container)
})
```
