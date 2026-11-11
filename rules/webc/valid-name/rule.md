---
id: webc/valid-name
title: A custom element name is lowercase, starts with a letter, contains a hyphen and is not a reserved name, or define() throws.
severity: serious
check: static
applies:
  - jsx
  - html
  - vue
  - svelte
  - astro
skill: fe-web-components
since: 0.1.0
sources:
  - title: HTML Standard, Custom elements (valid custom element name)
    url: https://html.spec.whatwg.org/multipage/custom-elements.html
  - title: MDN, Using custom elements
    url: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
---

## Why

`customElements.define('MyButton', …)` or `define('button', …)` throws a `SyntaxError` when the module loads: the element is never defined, every instance stays an unknown inline element, and any code after the call in that module does not run.

## Fix

Use a lowercase name with a hyphen, ideally with a project prefix: `acme-button`, `x-date-picker`. Avoid the reserved names `annotation-xml`, `color-profile`, `font-face`, `font-face-src`, `font-face-uri`, `font-face-format`, `font-face-name` and `missing-glyph`.

## Examples

```js
// bad
customElements.define('DatePicker', DatePicker)
// good
customElements.define('acme-date-picker', DatePicker)
```
