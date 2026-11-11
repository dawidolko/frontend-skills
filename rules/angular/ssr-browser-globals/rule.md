---
id: angular/ssr-browser-globals
title: Code that runs on the server never touches window, document, navigator or localStorage directly; use DI or afterNextRender.
severity: serious
check: manual
applies:
  - angular
stack:
  - angular
skill: fe-angular
since: 0.1.0
sources:
  - title: Angular, Server-side and hybrid rendering (authoring server-compatible components)
    url: https://angular.dev/guide/ssr
---

## Why

With SSR or prerendering, constructors, `ngOnInit`, services and `computed()` run in Node, where `window`, `document` and `localStorage` do not exist. A direct access throws during rendering: the page fails to render on the server or the build fails while prerendering.

## Fix

Inject `DOCUMENT` from `@angular/core` for the document, and put browser-only work (measuring, `localStorage`, third-party widgets) in `afterNextRender()` or `afterEveryRender()`, which run only in the browser. Do not branch the template on `isPlatformBrowser`; that renders different markup on server and client and breaks hydration. Manual because the engine does not read `.ts` files: search them for `window.`, `document.`, `localStorage` and `navigator.` when the project uses `@angular/ssr`.

## Examples

```ts
// bad
ngOnInit() { this.theme = localStorage.getItem('theme') ?? 'light' }
// good
constructor() { afterNextRender(() => this.theme.set(localStorage.getItem('theme') ?? 'light')) }
```
