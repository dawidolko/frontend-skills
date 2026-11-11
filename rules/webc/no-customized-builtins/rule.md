---
id: webc/no-customized-builtins
title: Build autonomous custom elements that wrap a native element; do not extend built-ins with is=, which Safari does not support.
severity: moderate
check: static
applies:
  - jsx
  - html
  - vue
  - svelte
  - astro
  - angular
skill: fe-web-components
since: 0.1.0
sources:
  - title: MDN, Using custom elements (types of custom element)
    url: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
  - title: MDN, the is global attribute
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/is
---

## Why

A customized built-in (`customElements.define('fancy-button', FancyButton, { extends: 'button' })` used as `<button is="fancy-button">`) is not supported in Safari, and its maker has said it does not plan to add it. On every iPhone and Mac with Safari the element stays a plain button: the behaviour you added is silently missing.

## Fix

Define an autonomous element (`<fancy-button>`) and put a real `<button>` inside its shadow root, or keep the native element and add the behaviour with a small script or a framework directive. If you depend on `is=`, load a polyfill and test in Safari.

## Examples

```js
// bad
customElements.define('fancy-button', FancyButton, { extends: 'button' })
// good
customElements.define('fancy-button', FancyButton) // renders <button> in its shadow root
```
