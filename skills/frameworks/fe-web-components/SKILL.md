---
name: fe-web-components
description: Writes and reviews custom elements, plain or with Lit 3 - names, lifecycle, attributes and properties, shadow DOM styling, events, form-associated controls with ElementInternals, accessibility across the shadow boundary. Use when defining a custom element, writing a LitElement, wrapping a native control in shadow DOM, or asked to review a web component.
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Web components and Lit
  area: frameworks
  lane: B
  requires: lit webc
  globs: "**/*.js **/*.ts **/*.css **/*.html"
  rules: "webc/valid-name webc/constructor-no-attributes webc/host-hidden webc/lit-class-fields webc/lit-immutable-updates webc/lit-unsafe-html webc/no-customized-builtins webc/form-associated webc/aria-idrefs-same-tree"
  version: 0.1.0
---

# Web components and Lit

Read `.frontend-skills/profile.json` (Lit version, TypeScript settings) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Name elements lowercase with a hyphen and a project prefix (`acme-date-picker`) (webc/valid-name).
- The constructor calls `super()` and never reads or adds attributes or children; do that in `connectedCallback` (webc/constructor-no-attributes).
- Next to `:host { display: … }` write `:host([hidden]) { display: none }` (webc/host-hidden).
- Never declare a Lit reactive property as a JavaScript class field; set it in the constructor or use `accessor` (webc/lit-class-fields).
- Replace reactive arrays and objects instead of mutating them (webc/lit-immutable-updates).
- `unsafeHTML`, `unsafeSVG` and `unsafeStatic` only get constants or sanitized strings (webc/lit-unsafe-html).
- Build autonomous elements around native ones; no `is=` built-ins, which Safari lacks (webc/no-customized-builtins).
- Custom form controls are form-associated and report value and validity through `ElementInternals` (webc/form-associated).
- Keep `for` and `aria-*` id references inside one tree; they do not cross a shadow root (webc/aria-idrefs-same-tree).
- Remove global listeners, timers and observers in `disconnectedCallback` (js/listener-cleanup).
- Inside the shadow root use real `<button>`, `<a>` and `<input>`, not `div` with `role` (a11y/no-click-on-static).

## Do this

1. Find how components are built: `extends LitElement` and `lit` in `package.json`, or `extends HTMLElement` with `customElements.define`. In TypeScript with Lit decorators check `useDefineForClassFields: false` in `tsconfig.json`, or use `accessor` on decorated fields (standard decorators).
2. Attributes for strings, numbers and booleans (reflect only what styling needs); properties for objects and arrays, never reflected. List watched attributes in `static observedAttributes`.
3. Set default semantics with `this.internals = this.attachInternals()`: `internals.role`, `internals.ariaExpanded`, custom states with `internals.states.add('open')` and `:state(open)`, instead of adding attributes to the host.
4. Dispatch events for changes the user caused: `new CustomEvent('acme-change', { detail, bubbles: true, composed: true })` when listeners outside other shadow roots must hear them.
5. Host wrapping one control: `delegatesFocus: true` (Lit: `static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }`).
6. Content that must show before JavaScript (LCP, search) is server-rendered with declarative shadow DOM (`<template shadowrootmode="open">`); Lit SSR is still a Labs package.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports invalid names, constructors that touch the host, `:host` without `[hidden]`, Lit class-field shadowing, in-place array mutation, `unsafeHTML` with data and `is=` built-ins. Files in `.ts` are not read yet; review them by hand.
- Run ESLint with `eslint-plugin-lit` and use the `lit-plugin` editor plugin for template type checks.
- Create the element with `document.createElement('acme-x')` in a test (catches constructor errors), test the form with and without the element, and check the accessibility tree: tools do not follow references across shadow roots reliably.

## References

- [references/web-components.md](references/web-components.md): lifecycle, attributes and properties, events, styling, forms and ElementInternals, focus, Lit 3 specifics and the change from Lit 2. Read it when creating a component or a form control.
