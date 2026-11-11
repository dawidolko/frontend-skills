---
id: html/constraint-attr-type
title: Validation attributes match the input type (pattern and maxlength on text-like types, min, max and step on number and date types).
severity: moderate
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
skill: fe-forms
since: 0.1.0
sources:
  - title: HTML Standard, input type attribute summary (which attributes apply to which type)
    url: https://html.spec.whatwg.org/multipage/input.html#concept-input-apply
  - title: MDN, Client-side form validation
    url: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation
---

## Why

Each constraint attribute applies only to some input types; on any other type it is ignored without a warning. `pattern` and `maxlength` on `type="number"`, or `min` and `max` on a text field, look like validation in review but never run, so bad values reach the server.

## Fix

Use the attributes the type supports: for numbers and dates `min`, `max` and `step`; for text, email, URL, phone, search and password `pattern`, `minlength` and `maxlength`. For a code of digits, switch to `type="text" inputmode="numeric"` with `pattern`. Always validate on the server as well.

## Examples

```html
<!-- bad -->
<input id="qty" type="number" maxlength="2">
<!-- good -->
<input id="qty" type="number" min="1" max="99">
```
