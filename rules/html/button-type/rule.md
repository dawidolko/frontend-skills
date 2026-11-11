---
id: html/button-type
title: Every button states its type (button, submit or reset); the default is submit.
severity: minor
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
skill: fe-html
since: 0.1.0
sources:
  - title: MDN, the button element (type)
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button
  - title: WHATWG HTML, the button element
    url: https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element
---

## Why

A `<button>` with no type submits its form. A "Show password" or "Add row" button inside a form then sends the form by accident, and the bug appears only when the markup is moved into a form later.

## Fix

Write `type="button"` on every button that runs script, and `type="submit"` on the one that submits, so intent is visible in the markup.

## Examples

```html
<!-- bad -->
<button onclick="toggle()">Show password</button>
<!-- good -->
<button type="button" onclick="toggle()">Show password</button>
```
