---
id: angular/router-aria-current
title: A routerLinkActive link also sets ariaCurrentWhenActive, so the current page is announced, not only styled.
severity: moderate
check: static
applies:
  - angular
stack:
  - angular
wcag:
  - 1.3.1
level: A
skill: fe-angular
since: 0.1.0
sources:
  - title: Angular, Accessibility best practices (active links identification)
    url: https://angular.dev/best-practices/a11y
  - title: Angular API, RouterLinkActive (ariaCurrentWhenActive)
    url: https://angular.dev/api/router/RouterLinkActive
---

## Why

`routerLinkActive` only adds a class: sighted users see which navigation item is the current page, but a screen reader announces every link the same way. The relationship shown visually is missing from the markup.

## Fix

Add `ariaCurrentWhenActive="page"` next to `routerLinkActive` (use `"step"`, `"location"` or `"true"` where those fit better). Angular then sets `aria-current` while the link is active and removes it afterwards.

## Examples

```html
<!-- bad -->
<a routerLink="/orders" routerLinkActive="active">Orders</a>
<!-- good -->
<a routerLink="/orders" routerLinkActive="active" ariaCurrentWhenActive="page">Orders</a>
```
