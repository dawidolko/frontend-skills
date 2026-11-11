---
id: vue/no-v-if-with-v-for
title: Never put v-if and v-for on the same element; filter in a computed list or move v-if to a wrapper.
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
  - title: Vue docs, List Rendering (v-for with v-if)
    url: https://vuejs.org/guide/essentials/list
  - title: Vue Style Guide, Priority A (avoid v-if with v-for)
    url: https://vuejs.org/style-guide/rules-essential
---

## Why

In Vue 3, `v-if` is evaluated before `v-for` on the same element, so the condition cannot see the loop variable: `v-for="user in users" v-if="user.active"` throws or hides the whole list. In Vue 2 the order was the reverse, which is why old code and old answers still show this pattern.

## Fix

Filter in a computed property and loop over it (`v-for="user in activeUsers"`). To hide the whole list, put `v-if` on a wrapper element or a `<template>` around the loop.

## Examples

```vue
<!-- bad -->
<li v-for="user in users" v-if="user.active" :key="user.id">{{ user.name }}</li>
<!-- good -->
<li v-for="user in activeUsers" :key="user.id">{{ user.name }}</li>
```
