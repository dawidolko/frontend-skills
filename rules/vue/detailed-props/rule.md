---
id: vue/detailed-props
title: Declare props with their types (an object with type, or a TypeScript type), not as a bare array of names.
severity: minor
check: static
applies:
  - vue
stack:
  - vue
  - nuxt
skill: fe-vue
since: 0.1.0
sources:
  - title: Vue Style Guide, Priority A (use detailed prop definitions)
    url: https://vuejs.org/style-guide/rules-essential
  - title: Vue docs, Props (prop validation)
    url: https://vuejs.org/guide/components/props
---

## Why

`defineProps(['status', 'items'])` accepts anything: a string where an array was expected reaches the template and fails there, far from the caller. The component's contract is not written anywhere, and editors cannot help the next person who uses it.

## Fix

Use the type-based declaration in TypeScript (`defineProps<{ status: 'open' | 'closed'; items: Item[] }>()`) or the object form with `type`, `required` and, where useful, `validator`. Give optional props defaults with `withDefaults` or destructuring defaults (Vue 3.5).

## Examples

```js
// bad
const props = defineProps(['status'])
// good
const props = defineProps({ status: { type: String, required: true, validator: (v) => ['open', 'closed'].includes(v) } })
```
