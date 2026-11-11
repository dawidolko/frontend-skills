---
id: webc/lit-class-fields
title: In JavaScript, a Lit reactive property is never also declared as a class field; the field hides Lit's accessor and updates stop.
severity: serious
check: static
applies:
  - jsx
stack:
  - lit
skill: fe-web-components
since: 0.1.0
sources:
  - title: Lit, Reactive properties (avoiding issues with class fields)
    url: https://lit.dev/docs/components/properties/
---

## Why

Lit makes each reactive property an accessor on the prototype. A class field with the same name (`open = false`) creates an own property on every instance that hides that accessor, so assigning `this.open = true` changes the value but never schedules a render: the component looks frozen and no error is shown.

## Fix

In JavaScript, set initial values in the constructor after `super()`: `this.open = false`. With decorators in JavaScript, use `accessor` (`@property() accessor open = false`). In TypeScript, set `useDefineForClassFields: false` in `tsconfig.json`, or use `declare` or `accessor` on the field.

## Examples

```js
// bad
static properties = { open: { type: Boolean } }
open = false
// good
static properties = { open: { type: Boolean } }
constructor() {
  super()
  this.open = false
}
```
