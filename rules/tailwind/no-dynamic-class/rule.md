---
id: tailwind/no-dynamic-class
title: Write every Tailwind class as a complete string; never build one from fragments such as bg-${color}-500.
severity: moderate
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
stack:
  - tailwind
skill: fe-tailwind
since: 0.1.0
sources:
  - title: Tailwind CSS docs, Detecting classes in source files (dynamic class names)
    url: https://tailwindcss.com/docs/detecting-classes-in-source-files
---

## Why

Tailwind finds the classes to generate by reading your files as plain text. `bg-${color}-500` is not in the text, so no CSS is generated for it: the element shows unstyled, often only for the colour or size nobody tried in development, and only in the production build.

## Fix

Map each state to a complete class string and pick one: `const tone = { danger: 'bg-red-600 text-white', ok: 'bg-green-600 text-white' }[status]`. For values that really are dynamic (a user's chosen colour), set a CSS variable in `style` and use it in a class: `style={{ '--accent': color }}` with `bg-(--accent)`.

## Examples

```jsx
// bad
<span className={`bg-${color}-600 text-${size}`}>{label}</span>
// good
const TONE = { red: 'bg-red-600', green: 'bg-green-600' }
<span className={`${TONE[color]} text-sm`}>{label}</span>
```
