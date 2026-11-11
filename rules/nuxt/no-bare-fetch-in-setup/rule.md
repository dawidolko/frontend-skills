---
id: nuxt/no-bare-fetch-in-setup
title: Load a page's initial data with useFetch or useAsyncData, not a bare $fetch at the top of script setup.
severity: moderate
check: static
applies:
  - vue
stack:
  - nuxt
skill: fe-nuxt
since: 0.1.0
sources:
  - title: Nuxt docs, Data Fetching (the need for useFetch and useAsyncData)
    url: https://nuxt.com/docs/4.x/getting-started/data-fetching
  - title: Nuxt docs, $fetch
    url: https://nuxt.com/docs/4.x/api/utils/dollarfetch
---

## Why

Code at the top of `<script setup>` runs on the server and again in the browser during hydration. A bare `$fetch` there requests the same data twice, the second time while the user waits, and the browser's result can differ from the server's HTML, which gives a hydration mismatch.

## Fix

Wrap the initial load: `const { data, status, error } = await useFetch('/api/products')`, or `useAsyncData('products', () => $fetch('/api/products'))` for custom logic. The server's result travels in the page payload and the browser reuses it. Keep `$fetch` for requests that a user action starts.

## Examples

```js
// bad (top of script setup)
const products = await $fetch('/api/products')
// good
const { data: products, status } = await useFetch('/api/products')
```
