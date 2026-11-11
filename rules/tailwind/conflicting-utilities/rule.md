---
id: tailwind/conflicting-utilities
title: One element never carries two utilities that set the same property under the same variant (p-2 p-4, flex grid).
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
  - title: Tailwind CSS docs, Styling with utility classes (managing style conflicts)
    url: https://tailwindcss.com/docs/styling-with-utility-classes
---

## Why

When `p-2` and `p-4` sit on one element, the winner is whichever rule comes later in the generated stylesheet, not the one written later in the class attribute. The result looks right by accident, changes when Tailwind reorders its output, and tells the next reader nothing about what was meant.

## Fix

Keep one of them. When a component takes extra classes from its caller, give it explicit props for its variants (`size="lg"`) instead of letting callers append overrides, or merge class lists with a helper that resolves conflicts (such as `tailwind-merge`). Different variants are fine: `block md:flex`.

## Examples

```html
<!-- bad -->
<div class="flex grid gap-2 p-2 p-4">…</div>
<!-- good -->
<div class="grid gap-2 p-4 md:flex">…</div>
```
