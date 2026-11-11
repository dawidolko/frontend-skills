---
id: a11y/non-text-contrast
title: Borders of fields, checkboxes, toggles, focus rings and meaningful icons have at least 3:1 contrast with their neighbours.
severity: serious
check: manual
applies:
  - css
  - scss
  - less
  - page
wcag:
  - 1.4.11
level: AA
skill: fe-a11y-visual
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 1.4.11 Non-text Contrast
    url: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
---

## Why

A text field drawn with a pale grey line on white, or a toggle whose on and off states differ only slightly, cannot be found or read by people with low vision. No automated engine checks this today.

## Fix

Give the boundary that identifies a control (input border, checkbox box, switch track) and every state indicator 3:1 against the adjacent colour. The focus ring needs 3:1 too. Icons that carry meaning without text (a warning sign, a chart line) need 3:1 against their background.

## Examples

```css
/* bad: #e5e7eb border on white is about 1.2:1 */
input { border: 1px solid #e5e7eb; }
/* good: #6b7280 on white is about 4.8:1 */
input { border: 1px solid #6b7280; }
```
