---
id: js/document-write
title: Never insert content with document.write; create elements or load scripts with the DOM.
severity: moderate
check: static
applies:
  - jsx
  - html
  - vue
  - svelte
  - astro
skill: fe-javascript
since: 0.1.0
sources:
  - title: MDN, Document.write() (warning and notes)
    url: https://developer.mozilla.org/en-US/docs/Web/API/Document/write
---

## Why

`document.write` blocks the HTML parser while it runs; a script written with it must download before the page can continue, and Chrome may refuse to run such a script on slow connections. Called after the page has loaded, it wipes the whole document. It also writes raw markup, so untrusted text becomes script.

## Fix

Create elements (`document.createElement`, `append`, `textContent`) or use a `<template>`. Load a third-party script with `<script async src>` or by appending a script element.

## Examples

```js
// bad
document.write('<script src="https://example.com/widget.js"><\/script>')
// good
const script = Object.assign(document.createElement('script'), { src: 'https://example.com/widget.js', async: true })
document.head.append(script)
```
