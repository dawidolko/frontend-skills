---
id: a11y/dialog-focus
title: A modal moves focus inside on open, keeps Tab inside, closes on Escape, and returns focus to the control that opened it.
severity: serious
check: manual
applies:
  - page
wcag:
  - 2.4.3
  - 2.1.2
level: A
skill: fe-a11y-dialog
since: 0.1.0
sources:
  - title: WAI-ARIA Authoring Practices, Dialog (Modal) pattern
    url: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
  - title: WCAG 2.2, Understanding SC 2.4.3 Focus Order
    url: https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html
---

## Why

If focus stays behind the overlay, keyboard and screen reader users keep working in a page they cannot see. If it is lost on close, they start again from the top of the page.

## Fix

On open, focus the first field, or the least destructive button in a confirmation, or the dialog heading (`tabindex="-1"`) when the content is long; `autofocus` on that element inside `<dialog>` does it. While open, the rest of the page is inert (`showModal()` does this). On close, focus the trigger again; if it is gone, focus the next logical place. Test with the keyboard and a screen reader.

## Examples

```js
let trigger
openButton.addEventListener('click', () => { trigger = document.activeElement; dialog.showModal() })
dialog.addEventListener('close', () => trigger?.focus())
```
