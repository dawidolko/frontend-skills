---
id: security/no-eval
title: Front-end code never runs strings as code - no eval, new Function or string arguments to setTimeout and setInterval.
severity: serious
check: static
applies:
  - html
  - jsx
  - vue
  - svelte
  - astro
skill: fe-security
since: 0.1.0
sources:
  - title: MDN, eval() (never use eval)
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
  - title: OWASP Cheat Sheet Series, DOM based XSS Prevention
    url: https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html
---

## Why

Any of these turns a string into running code. If any part of the string can come from a URL, storage, a message or an API, an attacker can run script in the page. They also force a Content Security Policy to allow `'unsafe-eval'`, which weakens it for everything else.

## Fix

Parse data with `JSON.parse`, look functions up in an object (`handlers[name]()`), and pass functions to timers (`setTimeout(() => refresh(), 1000)`). Keep `'unsafe-eval'` out of the CSP.

## Examples

```js
// bad
const settings = eval('(' + raw + ')')
setTimeout('refresh()', 1000)
// good
const settings = JSON.parse(raw)
setTimeout(refresh, 1000)
```
