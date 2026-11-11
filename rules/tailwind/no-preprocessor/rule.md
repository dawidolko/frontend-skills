---
id: tailwind/no-preprocessor
title: Do not run Tailwind CSS 4 through Sass, Less or Stylus; use plain CSS with native nesting and variables.
severity: moderate
check: static
applies:
  - project
stack:
  - tailwind
skill: fe-tailwind
since: 0.1.0
sources:
  - title: Tailwind CSS docs, Compatibility (Sass, Less, and Stylus)
    url: https://tailwindcss.com/docs/compatibility
---

## Why

Tailwind 4 is itself the CSS build step: it bundles imports, handles nesting and exposes the theme as CSS variables. Tailwind's documentation says it is not designed to run behind a preprocessor; mixing them causes broken `@import` resolution, Sass errors on Tailwind syntax (`@theme`, `@utility`, `--spacing(4)`) and two build steps doing the same work.

## Fix

Rename the Tailwind entry from `.scss` to `.css` and replace Sass features with CSS: nesting is native, `$variables` become `@theme` or `:root` custom properties, mixins become `@utility` or components, `@use` partials become `@import "./file.css"`. Keep Sass only for an old part of the code base that does not use Tailwind, and plan its removal.

## Examples

```scss
// bad: src/main.scss in a project with tailwindcss 4 and sass
@import "tailwindcss";
$brand: #0a7a3e;
// good: src/main.css
@import "tailwindcss";
@theme { --color-brand-600: #0a7a3e; }
```
