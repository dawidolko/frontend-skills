---
id: angular/control-flow
title: Templates use the built-in @if, @for and @switch blocks, not the *ngIf, *ngFor and *ngSwitch directives deprecated in v20.
severity: minor
check: static
applies:
  - angular
stack:
  - angular
skill: fe-angular
since: 0.1.0
sources:
  - title: Angular, Control flow
    url: https://angular.dev/guide/templates/control-flow
  - title: Angular API, NgIf (deprecated since v20.0)
    url: https://angular.dev/api/common/NgIf
  - title: Angular, Migration to control flow syntax
    url: https://angular.dev/reference/migrations/control-flow
---

## Why

`NgIf`, `NgFor` and `NgSwitch` are deprecated since Angular 20 with the intent to remove them in a later major. The built-in blocks need no `CommonModule` import, type-narrow inside `@if`, make `track` mandatory-by-habit in `@for`, and give an `@empty` branch for lists.

## Fix

Run `ng generate @angular/core:control-flow` to migrate a project, then review the result. By hand: `*ngIf="user as u"` becomes `@if (user; as u) { … }`, `*ngFor="let item of items; trackBy: byId"` becomes `@for (item of items; track item.id) { … } @empty { … }`, and `[ngSwitch]` becomes `@switch (x) { @case (…) { … } }`.

## Examples

```html
<!-- bad -->
<li *ngFor="let item of items">{{ item.name }}</li>
<!-- good -->
@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <li>No items yet.</li>
}
```
