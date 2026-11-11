---
id: webc/host-hidden
title: Shadow styles that give :host a display also add :host([hidden]) { display none }, or the hidden attribute stops working.
severity: moderate
check: static
applies:
  - jsx
  - html
  - css
  - scss
skill: fe-web-components
since: 0.1.0
sources:
  - title: web.dev, Custom element best practices (:host display and hidden)
    url: https://web.dev/articles/custom-elements-best-practices
  - title: MDN, :host
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/:host
---

## Why

A custom element is `display: inline` by default, so components set `:host { display: block }`. That author rule beats the browser's own `[hidden] { display: none }`, so `<acme-panel hidden>` stays visible: menus that should be closed show, and screen reader users hear content that should be gone.

## Fix

Next to every `:host { display: … }`, add `:host([hidden]) { display: none; }`. Keep the default display as the first rule of the component's styles so it is easy to find.

## Examples

```css
/* bad */
:host { display: block; }
/* good */
:host { display: block; }
:host([hidden]) { display: none; }
```
