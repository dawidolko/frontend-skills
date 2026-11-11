---
id: js/no-var
title: Declare variables with const, or let when they are reassigned; never with var.
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
  - title: MDN, var (description of hoisting and function scope)
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var
  - title: ESLint, no-var
    url: https://eslint.org/docs/latest/rules/no-var
---

## Why

`var` is scoped to the whole function, is hoisted as `undefined`, can be declared twice without an error and, at the top level of a classic script, becomes a property of `window`. Loops that create callbacks with `var` share one variable, a classic source of "every button opens the last item".

## Fix

Use `const` by default and `let` for a value you reassign. Both are block scoped, cannot be redeclared and throw when read before their declaration. Load the script as a module so top-level names stay out of the global object.

## Examples

```js
// bad
for (var i = 0; i < buttons.length; i++) buttons[i].onclick = () => open(i)
// good
for (const [i, button] of buttons.entries()) button.addEventListener('click', () => open(i))
```
