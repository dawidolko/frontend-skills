---
id: a11y/no-click-on-static
title: A click handler belongs on a button or link; a static element with one also needs a role, tabindex and a key handler.
severity: serious
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
wcag:
  - 2.1.1
  - 4.1.2
level: A
skill: fe-a11y-keyboard
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 2.1.1 Keyboard
    url: https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html
  - title: WCAG 2.2, Understanding SC 4.1.2 Name, Role, Value
    url: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html
  - title: WAI-ARIA Authoring Practices, Button pattern
    url: https://www.w3.org/WAI/ARIA/apg/patterns/button/
---

## Why

A `div` or `span` with a click handler cannot be reached with Tab, does not react to Enter or Space, and is announced as plain text, so keyboard and screen reader users cannot use it.

## Fix

Use `<button type="button">` for an action and `<a href>` for navigation; both are focusable, keyboard operable and announced correctly for free. Only when that is impossible, add `role="button"`, `tabindex="0"` and a key handler that runs the action on Enter and Space.

## Examples

```jsx
// bad
<div onClick={save}>Save</div>
// good
<button type="button" onClick={save}>Save</button>
```
