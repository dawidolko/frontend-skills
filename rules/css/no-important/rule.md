---
id: css/no-important
title: "!important appears only in utility classes, user-preference overrides and third-party overrides, never to win a specificity fight."
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
  - title: MDN, !important
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/important
  - title: MDN, Cascade layers
    url: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers
  - title: W3Schools, CSS The !important Rule
    url: https://www.w3schools.com/css/css_important.asp
---

## Why

An `!important` declaration can only be beaten by another `!important`, so each one invites the next and the cascade stops being readable. It is usually a sign that the selectors or the order of the stylesheets are wrong.

## Fix

Put the styles in cascade layers in the order they should win (`@layer reset, base, components, utilities;`), lower the specificity of the rule you are fighting (`:where()`, one class), or move the override into the component. Keep `!important` for single-purpose utilities (`.sr-only`, `.hidden`), user-preference blocks (`prefers-reduced-motion`, `forced-colors`) and overrides of third-party inline styles; mark the last with `fs-ignore css/no-important` and the reason.

## Examples

```css
/* bad */
.header .nav a.active { color: #fff !important; }
/* good */
@layer base, components, utilities;
@layer components { .nav__link[aria-current="page"] { color: var(--color-on-brand); } }
```
