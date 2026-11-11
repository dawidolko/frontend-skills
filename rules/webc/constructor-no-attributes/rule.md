---
id: webc/constructor-no-attributes
title: A custom element constructor never reads or adds attributes or children; do that in connectedCallback.
severity: serious
check: static
applies:
  - jsx
  - html
skill: fe-web-components
since: 0.1.0
sources:
  - title: HTML Standard, Requirements for custom element constructors and reactions
    url: https://html.spec.whatwg.org/multipage/custom-elements.html
  - title: MDN, Using custom elements (custom element lifecycle callbacks)
    url: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
---

## Why

An element made with `document.createElement('acme-card')` has no attributes and no children while its constructor runs, so reading them gives `null`. Adding them makes the creation fail: `createElement` throws, and so do frameworks that create elements this way. The element then works when written in HTML and breaks when a framework renders it.

## Fix

In the constructor only call `super()`, set default state, attach the shadow root and add listeners. Read attributes in `connectedCallback` or `attributeChangedCallback` (list them in `observedAttributes`), and set a default role or state through `ElementInternals` (`this.internals.role = 'button'`) instead of adding attributes to the host.

## Examples

```js
// bad
constructor() {
  super()
  this.setAttribute('role', 'button')
  this.label = this.getAttribute('label')
}
// good
constructor() {
  super()
  this.internals = this.attachInternals()
  this.internals.role = 'button'
  this.attachShadow({ mode: 'open' })
}
connectedCallback() { this.label = this.getAttribute('label') }
```
