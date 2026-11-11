---
id: webc/lit-immutable-updates
title: A Lit reactive array is replaced, not mutated in place (push, splice, sort), unless requestUpdate() follows.
severity: moderate
check: static
applies:
  - jsx
stack:
  - lit
skill: fe-web-components
since: 0.1.0
sources:
  - title: Lit, Reactive properties (mutating object and array properties)
    url: https://lit.dev/docs/components/properties/
---

## Why

Lit decides whether to render by comparing the old and new value of a property. `this.items.push(item)` keeps the same array, so nothing changes from Lit's point of view: the new item does not appear until something else triggers a render, and child components that receive the array never update.

## Fix

Assign a new array: `this.items = [...this.items, item]`, `this.items = this.items.filter(…)`, `this.items = this.items.toSorted(compare)`. If a mutation is really needed for performance, call `this.requestUpdate()` right after it, knowing that children holding the same array still do not update.

## Examples

```js
// bad
add(item) { this.items.push(item) }
// good
add(item) { this.items = [...this.items, item] }
```
