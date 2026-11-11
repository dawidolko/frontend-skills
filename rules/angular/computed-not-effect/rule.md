---
id: angular/computed-not-effect
title: Derive state with computed() (or linkedSignal()); never copy one signal into another inside effect().
severity: moderate
check: manual
applies:
  - angular
stack:
  - angular
skill: fe-angular
since: 0.1.0
sources:
  - title: Angular, Effects (use cases for effects)
    url: https://angular.dev/guide/signals/effect
  - title: Angular, Signals (computed signals)
    url: https://angular.dev/guide/signals
---

## Why

`effect(() => this.total.set(this.price() * this.qty()))` runs after the change, so the template first renders the old total and then needs another pass; chains of such effects cause extra change detection, `ExpressionChangedAfterItHasBeenChecked` errors or loops. Angular's guide calls effects a last resort for syncing with the outside world.

## Fix

`total = computed(() => this.price() * this.qty())`. When the derived value must also be settable by the user (a selection reset when the list changes), use `linkedSignal()`. Keep `effect()` for logging, `localStorage`, a canvas or a third-party widget. This rule is manual because the engine does not read `.ts` files; the angular-eslint rules and a review of every `effect(` that calls `.set(` or `.update(` find it.

## Examples

```ts
// bad
total = signal(0)
constructor() { effect(() => this.total.set(this.price() * this.qty())) }
// good
total = computed(() => this.price() * this.qty())
```
