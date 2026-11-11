---
id: css/unitless-line-height
title: line-height is a unitless number (for example 1.5), never px, em or a percentage, so it scales with each element's font size.
severity: minor
check: static
applies:
  - css
  - scss
  - less
  - html
  - vue
  - svelte
  - astro
skill: fe-css-architecture
since: 0.1.0
sources:
  - title: MDN, line-height (values, and the example "Prefer unitless numbers for line-height values")
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/line-height
  - title: WCAG 2.2, Understanding SC 1.4.12 Text Spacing
    url: https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
---

## Why

A length or percentage line height is computed once on the element and inherited as a fixed value, so a heading inside it gets the parent's line height and its lines overlap. A `px` line height also stays put when the person enlarges text or sets their own spacing, which clips text in fixed-height boxes.

## Fix

Write the ratio: `line-height: 1.5` for body text (at least 1.5 for paragraphs), about `1.1`–`1.3` for headings. To centre one line in a control, use padding or flex alignment, not a `line-height` equal to the height. With design tokens, keep the token unitless too (`--leading-body: 1.5`).

## Examples

```css
/* bad */
.btn { font-size: 16px; height: 40px; line-height: 40px; }
/* good */
.btn { font-size: 1rem; min-height: 2.5rem; padding-block: 0.5em; line-height: 1.5; }
```
