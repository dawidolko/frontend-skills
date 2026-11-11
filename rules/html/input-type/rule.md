---
id: html/input-type
title: An input for an email address, phone number or URL uses type email, tel or url, not text.
severity: minor
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
  - title: HTML Standard, the input element (states of the type attribute)
    url: https://html.spec.whatwg.org/multipage/input.html#states-of-the-type-attribute
  - title: MDN, input types
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#input_types
  - title: web.dev, Learn Forms, help users enter the right data
    url: https://web.dev/learn/forms/form-fields
---

## Why

A plain text field gives a phone the letter keyboard for a phone number, no `@` key for an email, and no built-in check of the format. The right type costs nothing and makes the field faster and less error-prone to fill.

## Fix

Use `type="email"`, `type="tel"` or `type="url"` and keep the matching `autocomplete` token. For digits that are not quantities (codes, card numbers) use `type="text"` with `inputmode="numeric"` (see `html/no-number-for-codes`).

## Examples

```html
<!-- bad -->
<input id="email" name="email">
<!-- good -->
<input id="email" name="email" type="email" autocomplete="email">
```
