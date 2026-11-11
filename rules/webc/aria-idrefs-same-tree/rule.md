---
id: webc/aria-idrefs-same-tree
title: id references (for, aria-labelledby, aria-describedby, aria-controls) point at an element in the same DOM tree, not across a shadow root.
severity: serious
check: manual
applies:
  - jsx
  - html
wcag:
  - 1.3.1
  - 4.1.2
level: A
skill: fe-web-components
since: 0.1.0
sources:
  - title: MDN, Using shadow DOM (encapsulation)
    url: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM
  - title: MDN, ElementInternals (labels and ARIA properties)
    url: https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals
---

## Why

An id is only looked up inside its own tree. `<label for="email">` in the page cannot reach `<input id="email">` inside a component's shadow root, and `aria-describedby="hint"` inside the shadow root cannot reach a hint in the page. The relationship looks right in the source and is simply missing for screen readers: the field is announced without a name or a description.

## Fix

Keep the label and the control in the same tree: render the label inside the component from an attribute or a slot, or make the host form-associated so an outer `<label for="host-id">` labels the host (webc/form-associated). For descriptions, pass the text in and render it next to the inner control. Test with a screen reader or the browser's accessibility tree; automated checkers do not reliably follow references across shadow roots. Cross-root references (`referenceTarget`) are still being specified; do not rely on them yet.

## Examples

```html
<!-- bad: the label cannot see the input inside the shadow root -->
<label for="email">Email</label>
<acme-input id="email"></acme-input>
<!-- good: the component renders its own label -->
<acme-input label="Email" type="email" autocomplete="email"></acme-input>
```
