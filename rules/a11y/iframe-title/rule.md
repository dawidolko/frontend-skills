---
id: a11y/iframe-title
title: Every visible iframe has a title that says what it contains (map, video, payment form).
severity: serious
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
axe:
  - frame-title
lighthouse:
  - frame-title
skill: fe-a11y-core
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 4.1.2 Name, Role, Value
    url: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html
  - title: WCAG 2.2 Technique H64, using the title attribute of the iframe element
    url: https://www.w3.org/WAI/WCAG22/Techniques/html/H64
---

## Why

Screen readers announce an iframe by its title. Without one, people hear "frame" and must enter it to find out whether it is a video, a map or an advert, often on every page.

## Fix

Add `title` with a short description of the content: `title="Product video: setting up sync"`, `title="Card payment form"`. Embeds from component libraries usually accept a `title` prop; pass it. Hide purely technical frames with `hidden` or `aria-hidden="true"` and `tabindex="-1"`.

## Examples

```html
<!-- bad -->
<iframe src="https://www.youtube-nocookie.com/embed/abc123"></iframe>
<!-- good -->
<iframe src="https://www.youtube-nocookie.com/embed/abc123" title="Video: setting up sync in two minutes"></iframe>
```
