---
id: a11y/tabs-keyboard
title: A tab list is one Tab stop; Left and Right Arrow (Up and Down when vertical), Home and End move between tabs.
severity: serious
check: manual
applies:
  - page
wcag:
  - 2.1.1
level: A
axe:
  - aria-required-children
  - aria-required-parent
skill: fe-a11y-tabs-accordion
since: 0.1.0
sources:
  - title: WAI-ARIA Authoring Practices, Tabs pattern (keyboard interaction)
    url: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
---

## Why

Screen reader users who hear "tab list" press the arrow keys, because that is what the role promises. If every tab is a separate Tab stop and arrows do nothing, the widget behaves unlike its announcement and keyboard users tab through every tab to reach the panel.

## Fix

Roving `tabindex`: the selected tab has `tabindex="0"`, the others `-1`. Arrow keys move focus (and select, in automatic activation) with wrapping; Home and End go to the first and last tab; Tab moves into the panel. Use manual activation (Enter or Space selects) when showing a panel is slow. Set `aria-orientation="vertical"` for a vertical list.

## Examples

```js
tablist.addEventListener('keydown', (e) => {
  const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key]
  if (next === undefined) return
  e.preventDefault()
  select((next + tabs.length) % tabs.length)
})
```
