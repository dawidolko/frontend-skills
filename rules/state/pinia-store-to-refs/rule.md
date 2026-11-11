---
id: state/pinia-store-to-refs
title: State and getters taken out of a Pinia store go through storeToRefs(); plain destructuring freezes them at their first value.
severity: serious
check: static
applies:
  - vue
stack:
  - pinia
skill: fe-state
since: 0.1.0
sources:
  - title: Pinia docs, Defining a Store (destructuring from a store)
    url: https://pinia.vuejs.org/core-concepts/
---

## Why

A Pinia store is a `reactive` object. `const { name, total } = useCartStore()` copies the current values into plain variables, so the template keeps showing them after the store changes: the cart badge says 0 while the cart fills up. Nothing warns about it.

## Fix

Use `const { name, total } = storeToRefs(store)` for state and getters, or read them through the store (`cart.total`). Actions are bound to the store and may be destructured directly: `const { addItem } = cart`.

## Examples

```js
// bad
const { items, total, addItem } = useCartStore()
// good
const cart = useCartStore()
const { items, total } = storeToRefs(cart)
const { addItem } = cart
```
