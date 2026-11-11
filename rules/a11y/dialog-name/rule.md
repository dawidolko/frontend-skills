---
id: a11y/dialog-name
title: Every dialog has an accessible name, usually aria-labelledby pointing at its visible heading.
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
  - 4.1.2
level: A
axe:
  - aria-dialog-name
skill: fe-a11y-dialog
since: 0.1.0
sources:
  - title: WAI-ARIA Authoring Practices, Dialog (Modal) pattern
    url: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
  - title: W3C, WAI-ARIA 1.2, dialog role (name required)
    url: https://www.w3.org/TR/wai-aria-1.2/#dialog
---

## Why

When a dialog opens, a screen reader announces its name and role first. Without a name the user hears only "dialog" and must explore it to learn whether it is a confirmation, an error or a form.

## Fix

Give the dialog a visible heading with an id and set `aria-labelledby` to it; use `aria-label` only when there is no visible title. For an alert dialog, also point `aria-describedby` at the message.

## Examples

```html
<!-- bad -->
<dialog><h2>Delete project?</h2>…</dialog>
<!-- good -->
<dialog aria-labelledby="del-title"><h2 id="del-title">Delete project?</h2>…</dialog>
```
