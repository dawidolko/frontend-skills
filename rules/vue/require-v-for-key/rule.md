---
id: vue/require-v-for-key
title: Every v-for gives its items a :key from the data; on a template v-for the key goes on the template tag.
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
  - title: Vue docs, List Rendering (maintaining state with key)
    url: https://vuejs.org/guide/essentials/list
  - title: Vue Style Guide, Priority A (use keyed v-for)
    url: https://vuejs.org/style-guide/rules-essential
  - title: eslint-plugin-vue, require-v-for-key
    url: https://eslint.vuejs.org/rules/require-v-for-key
---

## Why

Without a key, Vue patches list items in place by position. When the list is sorted, filtered or an item is inserted, the DOM nodes and child component state (typed text, open panels, focus) stay where they were and end up next to the wrong data.

## Fix

Bind a stable, unique value from the item: `:key="item.id"`. On `<template v-for>`, put the key on the `<template>` itself (Vue 3), not on its children.

## Examples

```vue
<!-- bad -->
<li v-for="todo in todos">{{ todo.title }}</li>
<!-- good -->
<li v-for="todo in todos" :key="todo.id">{{ todo.title }}</li>
```
