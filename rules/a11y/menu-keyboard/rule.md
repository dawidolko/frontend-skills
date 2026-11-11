---
id: a11y/menu-keyboard
title: Menus implement their keys - arrows move between items, Enter activates, Escape closes and returns focus to the button.
severity: serious
check: manual
applies:
  - page
wcag:
  - 2.1.1
level: A
skill: fe-a11y-menus
since: 0.1.0
sources:
  - title: WAI-ARIA Authoring Practices, Menu Button pattern (keyboard interaction)
    url: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
  - title: WAI-ARIA Authoring Practices, Menu and Menubar pattern
    url: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
---

## Why

A `role="menu"` turns off the screen reader's own reading keys and hands the keyboard to the page. If the page does not implement arrows, Enter and Escape, the menu cannot be used at all.

## Fix

Opening with Enter, Space or Down Arrow focuses the first item (Up Arrow: the last); Up and Down move with wrapping; Home and End jump; typing a letter moves to the next item starting with it; Enter activates; Escape closes and focuses the button; Tab closes and moves on. Only one item has `tabindex="0"`. If this is more than the use case needs, use a disclosure (button plus list of links) instead.

## Examples

```js
menu.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { close(); button.focus() }
  if (e.key === 'ArrowDown') focusItem(index + 1)
  if (e.key === 'ArrowUp') focusItem(index - 1)
})
```
