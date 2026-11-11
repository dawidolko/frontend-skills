---
id: vue/no-reactivity-loss
title: Never destructure or reassign a reactive() object; use toRefs, a ref, or change its properties.
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
  - title: Vue docs, Reactivity Fundamentals (limitations of reactive)
    url: https://vuejs.org/guide/essentials/reactivity-fundamentals
---

## Why

Reactivity is tracked through the proxy that `reactive()` returns. `const { count } = state` copies the current value into a plain variable that never updates, and `state = reactive({...})` replaces the proxy the template and watchers still hold, so the screen keeps showing the old object.

## Fix

Prefer `ref()` for state you replace as a whole (`user.value = next`). To pass parts of a reactive object around, use `toRefs(state)` or `toRef(state, 'count')`, or a getter (`() => state.count`). To update many fields, mutate in place: `Object.assign(state, next)`. Props destructured in `<script setup>` stay reactive since Vue 3.5; wrap them in a getter when passing them to `watch`.

## Examples

```js
// bad
const state = reactive({ count: 0 })
const { count } = state
// good
const state = reactive({ count: 0 })
const { count } = toRefs(state)
```
