---
id: webc/form-associated
title: A custom form control is form-associated (formAssociated and attachInternals) and reports its value and validity to the form.
severity: serious
check: manual
applies:
  - jsx
  - html
skill: fe-web-components
since: 0.1.0
sources:
  - title: MDN, ElementInternals (setFormValue, setValidity, labels)
    url: https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals
  - title: MDN, Using custom elements
    url: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
---

## Why

An `<acme-select>` whose real input lives in its shadow root is invisible to the surrounding `<form>`: its value is not submitted, `required` does nothing, `form.reset()` skips it, and an outside `<label for>` cannot reach the inner input, so the field has no accessible name.

## Fix

Set `static formAssociated = true`, call `this.internals = this.attachInternals()` in the constructor, report the value with `this.internals.setFormValue(value)` on every change, and validity with `this.internals.setValidity({ valueMissing: true }, 'Choose a size', anchor)`. Implement `formResetCallback` and `formDisabledCallback`. A `<label for>` pointing at the host then labels it, and `this.internals.labels` lists those labels. `ElementInternals` is Baseline widely available (MDN). Manual because whether an element is a form control is a design fact the source does not state.

## Examples

```js
// bad: the inner input never reaches the form
class AcmeSize extends HTMLElement { /* shadow root with <select> only */ }
// good
class AcmeSize extends HTMLElement {
  static formAssociated = true
  constructor() { super(); this.internals = this.attachInternals() }
  set value(v) { this._value = v; this.internals.setFormValue(v) }
}
```
