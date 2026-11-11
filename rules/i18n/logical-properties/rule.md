---
id: i18n/logical-properties
title: In projects with a right-to-left locale, layout uses logical properties (margin-inline-start, inset-inline-end, text-align start).
severity: moderate
check: manual
applies:
  - css
  - scss
  - less
skill: fe-i18n
since: 0.1.0
sources:
  - title: MDN, CSS logical properties and values
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values
  - title: W3C Internationalization, CSS vs markup for bidi support
    url: https://www.w3.org/International/questions/qa-bidi-css-markup
---

## Why

`margin-left`, `padding-right`, `left: 0` and `text-align: left` stay on the same physical side when the page switches to `dir="rtl"`, so icons sit on the wrong side of labels and menus open off-screen. Overrides for every rule under `[dir="rtl"]` double the CSS and drift out of sync.

## Fix

Use the logical forms: `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `border-start-start-radius`, `text-align: start`. Flip directional icons (arrows, chevrons) with `:dir(rtl) .icon-arrow { transform: scaleX(-1); }`, but not logos, media controls or checkmarks. In a project with only left-to-right locales this is a good habit, not a defect (lane A's `css/logical-properties` covers it there).

## Examples

```css
/* bad */
.badge { margin-left: 0.5rem; text-align: left; }
/* good */
.badge { margin-inline-start: 0.5rem; text-align: start; }
```
