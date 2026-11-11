---
id: sass/no-extend-class
title: Extend only placeholder selectors (%name), or use a mixin; @extend of a real class copies selectors everywhere it appears.
severity: minor
check: static
applies:
  - scss
  - vue
  - svelte
  - astro
stack:
  - sass
skill: fe-sass
since: 0.1.0
sources:
  - title: Sass docs, @extend (placeholder selectors, extends or mixins)
    url: https://sass-lang.com/documentation/at-rules/extend/
---

## Why

`@extend .btn` adds the extending selector to every rule in the compiled CSS that mentions `.btn`, including nested, modified and third-party ones. The output grows in unexpected places, the order of rules changes which style wins, and extending across `@media` is an error. Renaming or restyling `.btn` then changes unrelated components.

## Fix

Put the shared declarations in a placeholder (`%button-base`) and extend that, or write a mixin (`@include button-base`) when the relationship is only "these look alike". In a component framework, reuse the component instead of the selector.

## Examples

```scss
// bad
.save-button { @extend .btn; }
// good
%button-base { padding: 0.5rem 1rem; border-radius: 0.25rem; }
.btn, .save-button { @extend %button-base; }
```
