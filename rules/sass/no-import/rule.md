---
id: sass/no-import
title: Load Sass files with @use and @forward, not @import, which is deprecated and will be removed in Dart Sass 3.
severity: moderate
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
  - title: Sass docs, Breaking change - @import and global built-in functions
    url: https://sass-lang.com/documentation/breaking-changes/import/
  - title: Sass docs, @use
    url: https://sass-lang.com/documentation/at-rules/use/
  - title: Sass docs, @import (plain CSS imports)
    url: https://sass-lang.com/documentation/at-rules/import/
---

## Why

`@import` puts every variable, mixin and function of every imported file into one global namespace, so names collide silently and nobody can tell where `$primary` comes from. A file imported twice is compiled twice. Dart Sass has deprecated it since 1.80.0 and prints a warning on every build; Dart Sass 3.0.0 removes it.

## Fix

Use `@use 'tokens';` and refer to members by namespace (`tokens.$space-4`, `tokens.rem(24)`); re-export a folder's partials from an index file with `@forward`. Configure a library with `@use 'lib' with ($primary: #0a7)` instead of setting variables before importing it. `sass-migrator module --migrate-deps src/main.scss` does most of the work. Plain CSS imports (`url(...)`, a `.css` file, an `http(s)://` URL or one with a media query) are not affected.

## Examples

```scss
// bad
@import 'tokens';
.card { padding: $space-4; }
// good
@use 'tokens';
.card { padding: tokens.$space-4; }
```
