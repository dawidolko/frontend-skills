---
id: a11y/combobox-keyboard
title: A combobox keeps focus in the input, marks the highlighted option with aria-activedescendant and supports Down, Up, Enter and Escape.
severity: serious
check: manual
applies:
  - page
wcag:
  - 2.1.1
  - 4.1.2
level: A
skill: fe-a11y-combobox
since: 0.1.0
sources:
  - title: WAI-ARIA Authoring Practices, Combobox pattern (keyboard interaction)
    url: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
  - title: WCAG 2.2, Understanding SC 4.1.3 Status Messages
    url: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
---

## Why

If focus jumps into the list, typing stops working; if the highlight is only a CSS class, a screen reader never says which suggestion is active, and the person cannot pick one.

## Fix

Keep DOM focus in the input. Down Arrow opens the list and moves the highlight; Up Arrow moves back; Enter accepts and closes; Escape closes (a second Escape may clear); Alt+Down opens without moving. Set `aria-activedescendant` on the input to the highlighted option's id and `aria-selected="true"` on that option. Announce the number of results in a polite live region after typing pauses.

## Examples

```js
input.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') { open(); highlight(active + 1) }
  if (e.key === 'Escape') close()
})
function highlight(i) {
  input.setAttribute('aria-activedescendant', options[i].id)
  options.forEach((o, j) => o.setAttribute('aria-selected', String(i === j)))
}
```
