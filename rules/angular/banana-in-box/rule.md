---
id: angular/banana-in-box
title: Two-way binding is written [(prop)], brackets outside; ([prop]) silently binds an event named [prop] instead.
severity: moderate
check: static
applies:
  - angular
stack:
  - angular
skill: fe-angular
since: 0.1.0
sources:
  - title: Angular, Two-way binding
    url: https://angular.dev/guide/templates/two-way-binding
  - title: angular-eslint, template rule banana-in-box
    url: https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/docs/rules/banana-in-box.md
---

## Why

`([ngModel])="name"` is read as an event binding to an event called `[ngModel]`, which never fires. The input shows no value and typing does not update the component, with no compile error to point at the cause.

## Fix

Swap the brackets: `[(ngModel)]="name"` (the "banana in a box": parentheses inside square brackets). With a `model()` input on your own component the same syntax binds both ways: `[(value)]="query"`.

## Examples

```html
<!-- bad -->
<input id="name" ([ngModel])="name">
<!-- good -->
<input id="name" [(ngModel)]="name">
```
