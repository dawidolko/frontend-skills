---
id: angular/for-track-id
title: An @for block tracks a stable unique field of the item (track item.id), not the item object itself.
severity: moderate
check: static
applies:
  - angular
stack:
  - angular
skill: fe-angular
since: 0.1.0
sources:
  - title: Angular, Control flow (why track in @for blocks is important)
    url: https://angular.dev/guide/templates/control-flow
---

## Why

`track item` compares items by object identity. Every time the list is replaced (a new HTTP response, an immutable update, a signal `set`), every object is new, so Angular destroys and recreates every row: focus and typed text in the rows are lost and the update is much slower than it needs to be.

## Fix

Track a field that is unique and stable for the item, such as `track item.id` or `track item.slug`. `track $index` is acceptable only for a static list that never reorders and holds no state. A list of strings or numbers may track the value itself (`track tag`); the check leaves those alone.

## Examples

```html
<!-- bad -->
@for (user of users(); track user) { <app-user-row [user]="user" /> }
<!-- good -->
@for (user of users(); track user.id) { <app-user-row [user]="user" /> }
```
