---
id: a11y/no-keyboard-trap
title: Keyboard focus can always leave a component with Tab, Shift+Tab or Escape; only an open modal keeps focus inside.
severity: critical
check: manual
applies:
  - page
wcag:
  - 2.1.2
level: A
skill: fe-a11y-keyboard
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 2.1.2 No Keyboard Trap
    url: https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html
  - title: WAI-ARIA Authoring Practices, Developing a Keyboard Interface
    url: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
---

## Why

A trap ends the visit for someone who uses only a keyboard: they cannot reach anything else and must reload. Traps come from custom focus loops, embedded editors and players, and modals whose trap stays on after closing.

## Fix

Tab through the whole page once by hand. A focus loop belongs only to an open modal (`<dialog>` opened with `showModal()` does it for you) and ends when it closes. Code editors and players that use Tab themselves must say how to leave (for example "press Escape, then Tab").

## Examples

```js
// bad: a keydown handler that always sends Tab back to the first field
form.addEventListener('keydown', (e) => { if (e.key === 'Tab') { e.preventDefault(); first.focus() } })
// good: no handler; or a trap only inside an open modal dialog
dialog.showModal()
```
