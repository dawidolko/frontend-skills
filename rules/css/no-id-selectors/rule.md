---
id: css/no-id-selectors
title: Style elements by class, not by id; an id selector outweighs any number of classes and makes the rule hard to override.
severity: minor
check: static
applies:
  - css
  - scss
  - html
  - vue
  - svelte
  - astro
skill: fe-css-architecture
since: 0.1.0
sources:
  - title: MDN, Specificity
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity
  - title: W3Schools, CSS Specificity
    url: https://www.w3schools.com/css/css_specificity.asp
---

## Why

One id in a selector beats any number of classes, so every later change to that element needs another id or `!important`. An id also exists once per page, so the style cannot be reused for a second instance of the component.

## Fix

Give the element a class and style the class (`.site-header`). Keep ids for fragment links, `for`/`aria-*` references and scripts. When you must target an id you do not control, use the attribute selector `[id="widget"]`, which weighs like a class, or wrap it in `:where(#widget)`.

## Examples

```css
/* bad */
#header .nav a { color: inherit; }
/* good */
.site-header__link { color: inherit; }
```
