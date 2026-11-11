---
id: css/no-fixed-height-text
title: Boxes that hold text do not combine a fixed height with hidden overflow; use min-height so enlarged or spaced text is not clipped.
severity: serious
check: static
applies:
  - css
  - scss
  - less
  - html
  - vue
  - svelte
  - astro
wcag:
  - 1.4.4
  - 1.4.12
level: AA
skill: fe-css-layout
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 1.4.12 Text Spacing
    url: https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
  - title: WCAG 2.2, Failure F104 (clipped or overlapping content when text spacing is adjusted)
    url: https://www.w3.org/WAI/WCAG22/Techniques/failures/F104
  - title: MDN, min-height
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/min-height
---

## Why

A box of `height: 72px; overflow: hidden` fits the text only at the designer's font size, line height and language. When someone enlarges text, raises line or letter spacing, or the copy is translated into a longer language, the end of the text is cut off without a trace.

## Fix

Use `min-height` (or `min-block-size`) and padding, and let the content decide the height. To shorten long text on purpose, use `line-clamp` with a way to read the rest. Fixed sizes are fine for media and for boxes whose width is fixed too (avatars, icon buttons). Check by applying the WCAG text-spacing values (line height 1.5, letter spacing 0.12em, word spacing 0.16em, paragraph spacing 2em).

## Examples

```css
/* bad */
.card__excerpt { height: 72px; overflow: hidden; }
/* good */
.card__excerpt { min-height: 4.5rem; }
```
