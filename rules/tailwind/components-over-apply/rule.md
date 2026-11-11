---
id: tailwind/components-over-apply
title: Remove repeated class lists with a component, a loop or a partial; keep @apply for small cases and third-party markup.
severity: minor
check: manual
applies:
  - css
  - vue
  - svelte
  - astro
stack:
  - tailwind
skill: fe-tailwind
since: 0.1.0
sources:
  - title: Tailwind CSS docs, Styling with utility classes (managing duplication)
    url: https://tailwindcss.com/docs/styling-with-utility-classes
  - title: Tailwind CSS docs, Functions and directives (@apply and @reference)
    url: https://tailwindcss.com/docs/functions-and-directives
---

## Why

A stylesheet of `.card { @apply ... }` rules rebuilds the class names, the specificity battles and the dead CSS that utilities were meant to remove, and hides from the markup what an element looks like. In Vue, Svelte and Astro `<style>` blocks and CSS modules, each block is a separate Tailwind run with no theme unless it starts with `@reference`.

## Fix

Repeat a class list through the framework: a component (`<Card>`), a loop over data, or a template partial. Use `@apply` (inside `@layer components`) for a few small cases such as styling a third-party widget's markup or a CMS's rich text; in a component style block, start with `@reference "../app.css";` or use theme variables (`var(--color-brand-600)`) directly.

## Examples

```css
/* bad: a class per button style, written in @apply */
.btn-primary { @apply rounded bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700; }
/* good: one Button component holds the class list; @apply only styles markup you do not own */
.prose-cms a { @apply text-brand-600 underline; }
```
