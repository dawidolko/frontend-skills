---
id: nuxt/fetch-composable-in-handler
title: Call useFetch and useAsyncData only in setup, plugins or composables; in event handlers use $fetch.
severity: moderate
check: static
applies:
  - vue
  - jsx
stack:
  - nuxt
skill: fe-nuxt
since: 0.1.0
sources:
  - title: Nuxt docs, Data Fetching (useFetch is meant for setup; $fetch for event-based requests)
    url: https://nuxt.com/docs/4.x/getting-started/data-fetching
  - title: Nuxt docs, useFetch
    url: https://nuxt.com/docs/4.x/api/composables/use-fetch
---

## Why

`useFetch` and `useAsyncData` register state with the current component and the page payload. Called from a click or submit handler, there is no setup context: each call creates new refs nobody watches, keys collide, results are cached when they should not be, and warnings about the missing Nuxt instance appear.

## Fix

Use `$fetch` in event handlers (`await $fetch('/api/orders', { method: 'POST', body })`), then update your state or call `refresh()` of a `useFetch` declared in setup. Wrapping `useFetch` in your own `use...` composable is fine, as long as that composable is called from setup.

## Examples

```js
// bad
async function onSubmit() {
  const { data } = await useFetch('/api/orders', { method: 'POST', body: form })
}
// good
const { data: orders, refresh } = await useFetch('/api/orders')
async function onSubmit() {
  await $fetch('/api/orders', { method: 'POST', body: form })
  await refresh()
}
```
