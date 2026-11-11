---
id: html/icon-from-set
title: When the project has an icon set (sprite, icon classes or an Icon component), markup uses it, never a hard-coded path to an icon file.
severity: minor
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
skill: fe-icons
since: 0.1.0
sources:
  - title: MDN, the SVG use element (referencing a symbol)
    url: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/use
  - title: MDN, the SVG symbol element
    url: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/symbol
  - title: vite-plugin-svg-icons, README (sprite from a folder of SVG files)
    url: https://github.com/vbenjs/vite-plugin-svg-icons
  - title: unplugin-icons, README (custom collections from a folder)
    url: https://github.com/unplugin/unplugin-icons
  - title: Angular Material, Icon (registering SVG icons)
    url: https://material.angular.dev/components/icon/overview
---

## Why

An icon set that the build generates from one folder of SVG files (a sprite, icon classes or an icon component) keeps every icon the same size, colour (`currentColor`) and accessible pattern, and picks up a changed or added SVG on the next build. A hand-written `<img src="/icons/close.svg">` next to it bypasses all of that: it cannot take the text colour, loads one request per icon, breaks when the folder, the base path or the hashed sprite name changes, and is easy to leave without the right `alt`.

## Fix

Use the project's own set (the `icon-sprite` helper in `.frontend-skills/profile.json`, or the component or classes the file already uses): its component (`<Icon name="close" />`, `<SvgIcon name="close" />`, `<mat-icon svgIcon="close">`, `<Icon name="close" />` from `astro-icon`), its classes (`<i class="icon icon-close" aria-hidden="true"></i>`), or a `<use href="#icon-close">` of the generated sprite. Add a new icon by dropping its SVG into the source folder (for example `src/icons/`) and rebuilding; never copy it into `public/` and link it. Decorative icons get `aria-hidden="true"`; an icon-only button gets an accessible name on the button.

Projects whose profile records the `icon-classes` helper are covered by `html/project-icons` instead.

## Examples

```vue
<!-- bad -->
<button type="button" aria-label="Close"><img src="/icons/close.svg" alt=""></button>
<!-- good -->
<button type="button" aria-label="Close"><Icon name="close" /></button>
```
