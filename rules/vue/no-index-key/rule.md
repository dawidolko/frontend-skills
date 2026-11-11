---
id: vue/no-index-key
title: A v-for key comes from the item's data, not from the loop index, when the list can change.
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
  - title: Vue API, the special attribute key
    url: https://vuejs.org/api/built-in-special-attributes
---

## Why

`:key="index"` is the same as no key for a list that changes: after a removal or a sort, index 2 now belongs to another item, so Vue reuses the old DOM and component state for the wrong row. Inputs keep the text of the removed item and transitions animate the wrong element.

## Fix

Use an id from the data (`:key="item.id"`). If the data has none, add ids when you create or load the items (`crypto.randomUUID()`), not in the template. The index is acceptable only for a static list that never reorders and holds no state.

## Examples

```vue
<!-- bad -->
<CartRow v-for="(line, i) in lines" :key="i" :line="line" />
<!-- good -->
<CartRow v-for="line in lines" :key="line.sku" :line="line" />
```
