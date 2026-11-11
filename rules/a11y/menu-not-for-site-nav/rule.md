---
id: a11y/menu-not-for-site-nav
title: Site navigation is a nav with a list of links and disclosure buttons, not role="menu" or role="menubar".
severity: moderate
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
wcag:
  - 4.1.2
level: A
skill: fe-a11y-menus
since: 0.1.0
sources:
  - title: WAI-ARIA Authoring Practices, Disclosure Navigation Menu example
    url: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/
  - title: WAI-ARIA Authoring Practices, Menu and Menubar pattern
    url: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
---

## Why

`role="menu"` tells screen readers to expect an application menu: arrow keys move, Tab leaves, items are commands. Website navigation built that way usually lacks the arrow-key code, and it hides that the items are links, so people cannot list or open them as links. The APG has a menubar example for navigation, but recommends the disclosure pattern as the simpler fit for most sites.

## Fix

Use `<nav aria-label="Main">` with `<ul>` and `<a href>`; mark the current page with `aria-current="page"`; open sub-lists with a `<button aria-expanded>` (the disclosure pattern). Keep `role="menu"` for command menus in applications (row actions, editor toolbars) and implement its keys.

## Examples

```html
<!-- bad -->
<nav><ul role="menubar"><li role="none"><a role="menuitem" href="/">Home</a></li></ul></nav>
<!-- good -->
<nav aria-label="Main"><ul><li><a href="/" aria-current="page">Home</a></li></ul></nav>
```
