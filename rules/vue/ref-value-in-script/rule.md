---
id: vue/ref-value-in-script
title: In script code, read and compare a ref or computed through .value; the ref object itself is always truthy.
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
  - title: Vue docs, Reactivity Fundamentals (declaring reactive state with ref)
    url: https://vuejs.org/guide/essentials/reactivity-fundamentals
  - title: eslint-plugin-vue, no-ref-as-operand
    url: https://eslint.vuejs.org/rules/no-ref-as-operand
---

## Why

Templates unwrap refs, script code does not. `if (isOpen)` tests the ref object, which is always truthy, so the branch always runs; `count + 1` gives `"[object Object]1"`, and `items === null` is never true. The code type-checks loosely in JavaScript and fails only at run time.

## Fix

Use `.value` in script: `if (isOpen.value)`, `count.value + 1`. In the template keep the plain name. If a value never needs to be reactive on its own, group it in an object returned from a composable rather than mixing refs and plain values.

## Examples

```js
// bad
const isOpen = ref(false)
function toggle() { if (isOpen) close() }
// good
const isOpen = ref(false)
function toggle() { if (isOpen.value) close() }
```
