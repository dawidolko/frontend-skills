---
id: sass/no-node-sass
title: Compile Sass with Dart Sass (the sass or sass-embedded package), never node-sass, which is deprecated LibSass.
severity: moderate
check: static
applies:
  - project
stack:
  - sass
skill: fe-sass
since: 0.1.0
sources:
  - title: Sass blog, LibSass is deprecated
    url: https://sass-lang.com/blog/libsass-is-deprecated/
  - title: Sass docs, @use (the module system LibSass never supported)
    url: https://sass-lang.com/documentation/at-rules/use/
---

## Why

`node-sass` wraps LibSass, which the Sass team deprecated: it gets no new features (no `@use`, no `math.div`, no modern colour functions), builds a native binary that often fails to install on new Node.js versions, and compiles some code differently from the Sass everyone else runs.

## Fix

Replace it with `sass` (or `sass-embedded`, which is faster on large projects) and point the bundler at it; Vite, webpack's `sass-loader` and the framework CLIs pick it up by name. Then fix the deprecation warnings Dart Sass prints, starting with `@import` (sass/no-import).

## Examples

```jsonc
// bad
"devDependencies": { "node-sass": "^9.0.0" }
// good
"devDependencies": { "sass": "^1.108.2" }
```
