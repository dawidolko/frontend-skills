---
id: js/no-eval
title: Never run strings as code - no eval, new Function, or a string as the first argument of setTimeout or setInterval.
severity: serious
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
  - title: MDN, eval() (never use direct eval)
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
  - title: MDN, Content Security Policy (unsafe-eval)
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP
  - title: ESLint, no-implied-eval
    url: https://eslint.org/docs/latest/rules/no-implied-eval
---

## Why

A string run as code executes with the page's full rights: if any part of it comes from a URL, storage or a server response, it is cross-site scripting. It also forces a Content Security Policy to allow `unsafe-eval` and stops the engine from optimising the surrounding code.

## Fix

Pass functions, not strings: `setTimeout(save, 500)`. Parse data with `JSON.parse`, look values up in an object or `Map` instead of building property names as code, and use a template or the DOM for markup.

## Examples

```js
// bad
setTimeout('refresh()', 1000)
const total = eval(`${a} + ${b}`)
// good
setTimeout(refresh, 1000)
const total = a + b
```
