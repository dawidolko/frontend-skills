---
id: css/rem-units
title: Font sizes are written in rem (or em), never px, in projects without a rem helper; with one, css/rem-helper applies.
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
  - title: MDN, CSS values and units (relative length units)
    url: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units
  - title: WCAG 2.2, Understanding SC 1.4.4 Resize Text
    url: https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
---

## Why

A `px` font size ignores the text size the person set in their browser, so text that is comfortable for the designer stays small for someone who needs it larger. Browser zoom still works, but the text-size setting is how many people with low vision read every site.

## Fix

Write font sizes in `rem` (or `em` inside a component that should follow its parent): `16px` is `1rem` at the default size. Fluid sizes keep rem bounds: `clamp(1rem, 0.9rem + 0.5vw, 1.25rem)`. When the profile records a px-to-rem function (helper `rem-function`, for example Foundation's `rem-calc()`), this rule steps aside and `css/rem-helper` asks for that function instead; with a build step that converts px (`px-to-rem-build`) px in the source is the convention.

## Examples

```css
/* bad */
.card__title { font-size: 20px; }
/* good */
.card__title { font-size: 1.25rem; }
```
