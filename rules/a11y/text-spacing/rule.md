---
id: a11y/text-spacing
title: Text survives line height 1.5, paragraph spacing 2em, letter spacing 0.12em and word spacing 0.16em without being cut off.
severity: serious
check: browser
applies:
  - page
wcag:
  - 1.4.12
level: AA
axe:
  - avoid-inline-spacing
skill: fe-a11y-visual
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 1.4.12 Text Spacing
    url: https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
---

## Why

People with dyslexia or low vision use extensions that widen spacing. Boxes with a fixed height and `overflow: hidden`, or inline spacing marked `!important`, then clip words or stop the override from working.

## Fix

Let text containers grow: `min-height` instead of `height`, no `overflow: hidden` on blocks of text, no `!important` on `line-height`, `letter-spacing` or `word-spacing` in inline styles. Test with a text spacing bookmarklet on the changed pages.

## Examples

```css
/* bad */
.card-title { height: 3rem; overflow: hidden; }
/* good */
.card-title { min-height: 3rem; }
```
