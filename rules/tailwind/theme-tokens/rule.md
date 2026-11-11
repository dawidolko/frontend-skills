---
id: tailwind/theme-tokens
title: An arbitrary value used again and again (bg-[#0a7a3e], p-[18px]) becomes a theme variable in @theme with its own utility.
severity: minor
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
  - title: Tailwind CSS docs, Theme variables
    url: https://tailwindcss.com/docs/theme
  - title: Tailwind CSS docs, Adding custom styles (arbitrary values)
    url: https://tailwindcss.com/docs/adding-custom-styles
---

## Why

Square-bracket values are an escape hatch for one-off cases. The same `#0a7a3e` typed in ten places is a design token without a name: changing the brand colour means a search and replace, near-duplicates (`#0a7a3f`) creep in, and dark mode cannot redefine it.

## Fix

Define it once in the CSS entry file: `@theme { --color-brand-600: #0a7a3e; --spacing-gutter: 1.125rem; }`, then use the generated utilities (`bg-brand-600`, `p-gutter`) and the CSS variable (`var(--color-brand-600)`) wherever plain CSS needs it. Tokens that are not Tailwind namespaces go in `:root` (see `css/design-tokens`).

## Examples

```html
<!-- bad -->
<button class="bg-[#0a7a3e] px-[18px]">Save</button> <a class="text-[#0a7a3e]">Help</a> <hr class="border-[#0a7a3e]">
<!-- good -->
<button class="bg-brand-600 px-gutter">Save</button> <a class="text-brand-600">Help</a> <hr class="border-brand-600">
```
