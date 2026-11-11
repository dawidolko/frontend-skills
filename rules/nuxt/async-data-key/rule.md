---
id: nuxt/async-data-key
title: A composable that wraps useAsyncData passes an explicit, unique key built from its inputs.
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
  - title: Nuxt docs, Data Fetching (keys; always create your own key in a custom composable)
    url: https://nuxt.com/docs/4.x/getting-started/data-fetching
  - title: Nuxt docs, useAsyncData (key parameter)
    url: https://nuxt.com/docs/4.x/api/composables/use-async-data
---

## Why

Without a key, Nuxt builds one from the file name and line of the `useAsyncData` call. Inside a composable that line is the same for every caller, so `useProduct(1)` and `useProduct(2)` share one cache entry: the second product page shows the first product's data until a refresh, and the payload holds the wrong value.

## Fix

Pass the key first and make it depend on the inputs: `useAsyncData(() => `product-${id.value}`, () => $fetch(`/api/products/${id.value}`))`, or a string key when the composable has no inputs. Keep options (`transform`, `pick`, `default`) the same for every call that shares a key.

## Examples

```js
// bad
export function useProduct(id) {
  return useAsyncData(() => $fetch(`/api/products/${id.value}`))
}
// good
export function useProduct(id) {
  return useAsyncData(() => `product-${id.value}`, () => $fetch(`/api/products/${id.value}`))
}
```
