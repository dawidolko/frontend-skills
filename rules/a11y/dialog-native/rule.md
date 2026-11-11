---
id: a11y/dialog-native
title: Build dialogs on the native <dialog> element opened with showModal() rather than a div with role="dialog".
severity: minor
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
wcag:
  - 2.4.3
  - 4.1.2
level: A
skill: fe-a11y-dialog
since: 0.1.0
sources:
  - title: MDN, the dialog element
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
  - title: HTML Standard, the dialog element
    url: https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element
  - title: WAI-ARIA Authoring Practices, Dialog (Modal) pattern
    url: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
---

## Why

A `div` dialog needs a hand-written focus trap, Escape handling, a way to hide the rest of the page from screen readers, and focus return. Each is a common source of bugs. `<dialog>` with `showModal()` does all of it and is Baseline widely available.

## Fix

Render `<dialog>`, open it with `dialog.showModal()` (modal) or `dialog.show()` (non-modal), close it with `dialog.close()` or a `<form method="dialog">`, and style the overlay with `::backdrop`. Keep a component library's dialog if the project uses one; check it renders `<dialog>` or implements the APG pattern.

## Examples

```html
<!-- bad -->
<div class="modal" role="dialog" aria-modal="true">…</div>
<!-- good -->
<dialog aria-labelledby="t"><h2 id="t">Newsletter</h2>…</dialog>
<script type="module">document.querySelector('dialog').showModal()</script>
```
