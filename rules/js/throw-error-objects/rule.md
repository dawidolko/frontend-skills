---
id: js/throw-error-objects
title: Throw and reject with Error objects (or subclasses), never with strings or plain objects.
severity: minor
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
  - title: MDN, throw (throwing an object)
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw
  - title: ESLint, no-throw-literal
    url: https://eslint.org/docs/latest/rules/no-throw-literal
---

## Why

A thrown string has no stack trace, no `name` and no `cause`, so the error report says only "Uncaught Load failed" with no file or line. Code that catches it cannot tell it apart with `instanceof`, and `error.message` is `undefined`.

## Fix

`throw new Error('Load failed', { cause: err })`, or a subclass (`class HttpError extends Error`) when callers need to tell errors apart. Reject promises with `Error` objects as well.

## Examples

```js
// bad
if (!res.ok) throw 'Load failed'
return Promise.reject({ code: 404 })
// good
if (!res.ok) throw new HttpError(res.status, 'Load failed')
return Promise.reject(new HttpError(404, 'Not found'))
```
