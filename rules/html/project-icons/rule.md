---
id: html/project-icons
title: Icons use the project's generated icon classes ({{icon-classes.example|its icon classes}}), not separate SVG image files.
severity: minor
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
requires:
  - icon-classes
skill: fe-images
since: 0.1.0
sources:
  - title: MDN, aria-hidden
    url: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-hidden
  - title: WCAG 2.2, Understanding SC 1.1.1 Non-text Content
    url: https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html
---

## Why

This project builds its icons into CSS classes ({{icon-classes.tool|an icon build step}}), so one cached file serves every icon and they share size and colour rules. An `<img src="…/icons/x.svg">` bypasses that build: another request per icon, an icon that does not follow the text colour, and a second way to do the same thing. The rule runs only in projects where such a build was detected.

## Fix

Use the generated class: `<i class="{{icon-classes.example|icon-<name>}}" aria-hidden="true"></i>` and give the control a text label (visible, or `aria-label` on the button). A new icon is added as an SVG in `{{icon-classes.sourceDir|the icon source folder}}` and the build is run again.

## Examples

```html
<!-- bad -->
<button type="button"><img src="/assets/icons/close.svg" alt="Close"></button>
<!-- good -->
<button type="button" aria-label="Close"><i class="icon-close" aria-hidden="true"></i></button>
```
