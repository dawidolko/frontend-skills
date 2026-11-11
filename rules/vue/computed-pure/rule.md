---
id: vue/computed-pure
title: A computed getter only derives a value - no async work, no requests and no changes to other state.
severity: moderate
check: static
applies:
  - vue
stack:
  - vue
  - nuxt
skill: fe-vue
since: 0.1.0
sources:
  - title: Vue docs, Computed Properties (getters should be side-effect free)
    url: https://vuejs.org/guide/essentials/computed
  - title: eslint-plugin-vue, no-async-in-computed-properties
    url: https://eslint.vuejs.org/rules/no-async-in-computed-properties
---

## Why

A computed is a cached derivation: Vue runs it when it likes, as often as it likes, and caches only its return value. An `async` getter returns a promise, not the data; a request inside it fires at unpredictable times, and setting other state from it causes update loops and hard-to-follow renders.

## Fix

Keep the getter a pure function of its sources. Load data in a watcher (`watch(id, load, { immediate: true })`), a data library or the framework's loader (`useFetch` in Nuxt), store the result in a ref, and derive from that ref in the computed.

## Examples

```js
// bad
const user = computed(async () => (await fetch(`/api/users/${id.value}`)).json())
// good
const user = ref(null)
watch(id, async (value) => { user.value = await getJson(`/api/users/${value}`) }, { immediate: true })
const name = computed(() => user.value?.name ?? '')
```
