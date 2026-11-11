---
id: a11y/link-is-link
title: An <a> is a real link with an href; an action is a <button>, never <a> without href, href="#" or javascript:.
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
lighthouse:
  - crawlable-anchors
skill: fe-a11y-keyboard
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 2.1.1 Keyboard
    url: https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html
  - title: WAI-ARIA Authoring Practices, Link pattern
    url: https://www.w3.org/WAI/ARIA/apg/patterns/link/
  - title: WAI-ARIA Authoring Practices, Button pattern
    url: https://www.w3.org/WAI/ARIA/apg/patterns/button/
  - title: MDN, the a element (accessibility concerns)
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a
---

## Why

An `<a>` without `href` is not focusable, so a keyboard user can never reach it. With `href="#"` or `javascript:` it is reachable but announced as a link, does nothing on Space, jumps to the top when the script fails, and search engines cannot follow it.

## Fix

If it goes somewhere, give it the real URL (`href="/pricing"`, or the router's link component). If it does something on this page (open a menu, submit, toggle), make it `<button type="button">` and style it as you like.

## Examples

```html
<!-- bad -->
<a onclick="openCart()">Cart</a>
<a href="#" onclick="openCart()">Cart</a>
<!-- good -->
<button type="button" onclick="openCart()">Cart</button>
<a href="/cart">Cart</a>
```
