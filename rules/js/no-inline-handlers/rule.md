---
id: js/no-inline-handlers
title: Attach event handlers from script with addEventListener, not with onclick="..." attributes in HTML.
severity: moderate
check: static
applies:
  - html
  - astro
skill: fe-javascript
since: 0.1.0
sources:
  - title: MDN, Introduction to events (inline event handlers - don't use these)
    url: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events
  - title: MDN, Content Security Policy (inline script and unsafe-inline)
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP
---

## Why

An `onclick="save()"` attribute is a string of script inside the markup: it only reaches functions on the global object, mixes behaviour into the HTML, and is blocked by any Content Security Policy that does not allow `unsafe-inline`, which is the main protection against injected script.

## Fix

Give the element a hook (`id`, a class or a `data-` attribute) and attach the handler from a module: `button.addEventListener('click', save)`. For many similar elements, add one listener to their container and find the target with `event.target.closest()`. Framework handlers (`onClick={...}`, `@click`, `(click)`) are not inline attributes and are fine.

## Examples

```html
<!-- bad -->
<button type="button" onclick="save()">Save</button>
<!-- good -->
<button type="button" id="save">Save</button>
<script type="module">document.getElementById('save').addEventListener('click', save)</script>
```
