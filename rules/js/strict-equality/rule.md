---
id: js/strict-equality
title: Compare with === and !==; loose == and != convert types first (x == null as a deliberate null-or-undefined test is the exception).
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
  - title: MDN, Equality comparisons and sameness
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness
  - title: W3Schools, JavaScript Best Practices (use === comparison)
    url: https://www.w3schools.com/js/js_best_practices.asp
  - title: ESLint, eqeqeq
    url: https://eslint.org/docs/latest/rules/eqeqeq
---

## Why

`==` converts both sides before comparing, so `"0" == 0`, `"" == 0` and `[] == false` are all true. A value read from a form field or a URL is a string, and a loose comparison with a number quietly passes or fails for the wrong reason.

## Fix

Use `===` and `!==`, and convert explicitly where the types differ (`Number(input.value) === 3`). Keep `x == null` only where you mean "null or undefined", or write `x === null || x === undefined`.

## Examples

```js
// bad
if (params.get('page') == 1) showFirst()
// good
if (Number(params.get('page')) === 1) showFirst()
```
