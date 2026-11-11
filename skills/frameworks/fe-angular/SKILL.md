---
name: fe-angular
description: Writes and reviews Angular 22 components, templates and services - signals, built-in control flow, zoneless and OnPush defaults, SSR and hydration, NgOptimizedImage, router accessibility, DomSanitizer - for fast, accessible apps. Use when editing a .component.ts or .component.html, migrating from *ngIf or NgModules, or asked to review Angular code.
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Angular components
  area: frameworks
  lane: B
  requires: angular
  globs: "**/*.component.ts **/*.component.html **/*.service.ts **/app.config.ts **/*.routes.ts"
  rules: "angular/control-flow angular/for-track-id angular/ng-optimized-image angular/router-aria-current angular/table-tbody angular/banana-in-box angular/computed-not-effect angular/ssr-browser-globals angular/no-bypass-security-trust"
  version: 0.1.0
---

# Angular components

Read `.frontend-skills/profile.json` (Angular major, SSR, CDK) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Use `@if`, `@for` and `@switch`; `*ngIf`, `*ngFor` and `NgSwitch` are deprecated since v20 (angular/control-flow).
- `@for` tracks a unique field (`track item.id`), not the object (angular/for-track-id).
- Two-way binding is `[(value)]`, never `([value])` (angular/banana-in-box).
- Derive state with `computed()` or `linkedSignal()`; `effect()` only syncs with the outside world (angular/computed-not-effect).
- Change signals with `set()` and `update()` and new values; never mutate their contents.
- Static images use `ngSrc` with `width` and `height` (or `fill`), the LCP image `priority` (angular/ng-optimized-image).
- `routerLinkActive` links set `ariaCurrentWhenActive="page"` (angular/router-aria-current); move focus to the main heading after navigation.
- With SSR, no direct `window`, `document` or `localStorage`; inject `DOCUMENT` or use `afterNextRender()` (angular/ssr-browser-globals).
- Write `<tbody>` in every table (angular/table-tbody).
- Never pass data to `bypassSecurityTrust*`; bind `[innerHTML]` and let Angular sanitize (angular/no-bypass-security-trust).
- Interactive elements are native `<button>` and `<a>`, also as component hosts (`button[appButton]`) (a11y/no-click-on-static).

## Do this

1. Read the `@angular/core` major from `package.json`. On v20+ components are standalone by default, on v21+ zoneless, on v22+ `OnPush`: do not write `standalone: true` or `changeDetection: OnPush` in new code.
2. Components: `input()`, `input.required()`, `output()`, `model()` instead of `@Input`/`@Output`; `inject()` instead of constructor parameters; `host: {}` instead of `@HostBinding`/`@HostListener`; `[class.x]` and `[style.x]` instead of `NgClass`/`NgStyle`.
3. State: a service holds a private `signal()` and exposes `asReadonly()` and `computed()` views. Reads with `httpResource()` or `resource()`; writes with `HttpClient` methods.
4. Routes lazy-load features with `loadComponent` and `loadChildren`. Below-the-fold widgets go in `@defer (on viewport)` with a sized `@placeholder`; never defer what is visible on first paint.
5. SSR: declare `RenderMode` per route in `app.routes.server.ts`; never prerender per-user pages; keep auth requests out of the transfer cache.
6. Accessibility: the CDK (`cdkTrapFocus`, `LiveAnnouncer`, `FocusMonitor`) or `@angular/aria` for widgets instead of hand-written keyboard code.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reads `*.component.html` templates: deprecated directives, identity tracking, plain `<img src>`, missing `ariaCurrentWhenActive`, rows without `<tbody>`, reversed two-way bindings. Inline templates in `.ts` files are not read yet; review them by hand.
- Run `ng lint` with angular-eslint (template accessibility rules, `prefer-control-flow`, `no-uncalled-signals`) and `ng build`; in development watch the console for hydration (NG05xx) and image warnings.
- Search `.ts` files for `effect(`, `bypassSecurityTrust` and, with SSR, `window.`, `document.` and `localStorage`.

## References

- [references/angular.md](references/angular.md): version defaults, signals and data APIs, control flow and `@defer`, SSR and hydration, images, accessibility, security, angular-eslint rules. Read it for a new feature, a migration or an SSR problem.
