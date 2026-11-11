# Sass reference

Depth for the `fe-sass` skill, for Dart Sass (latest stable checked 2026-11-11 on the npm registry: `sass` 1.108.2, `sass-embedded` 1.108.2). Rule ids in brackets: `frontend-skills explain <id>`.

## Deprecation timeline

| Change | Deprecated in | Removed in | Rule |
| --- | --- | --- | --- |
| `@import` and global built-in functions | 1.80.0 (October 2024) | 3.0.0, not before two years after 1.80.0 | [sass/no-import], [sass/no-global-builtins] |
| Colour functions `darken`, `lighten`, `saturate`, `desaturate`, `adjust-hue`, `opacify`, `fade-in`, `transparentize`, `fade-out`, channel getters | 1.79.0 | 2.0.0 | [sass/no-legacy-color-functions] |
| `/` as division (`math.div` and `list.slash` since 1.33.0) | warns during the transition | a future version | [sass/math-div] |
| Legacy JS API (`render`, `renderSync`) | 1.45.0 | 2.0.0 | use `compile` / `compileAsync` |
| LibSass and `node-sass` | the whole implementation | – | [sass/no-node-sass] |

Dart Sass warns at least three months before a breaking change; treat warnings as work items.

## Module system

| Old | New |
| --- | --- |
| `@import 'tokens';` then `$space-4` | `@use 'tokens';` then `tokens.$space-4` |
| an index file of `@import`s | `_index.scss` with `@forward 'tokens'; @forward 'mixins';` |
| set `$primary` before importing a library | `@use 'lib' with ($primary: #0a7a3e);` (library variables use `!default`) |
| a private helper visible everywhere | name it `-helper` or `_helper`; it is not exported |
| `@import 'theme.css';` | stays a plain CSS import (also `url()`, `http(s)://` and media-query imports) |

`@use` rules come first in a file, after `@forward` and variable declarations used to configure them. Namespace defaults to the last part of the URL; shorten with `as t`, avoid `as *` except for a small file you own.

## Built-in modules [sass/no-global-builtins]

| Global (deprecated) | Module call |
| --- | --- |
| `map-get`, `map-merge`, `map-has-key`, `map-keys` | `map.get`, `map.merge`, `map.has-key`, `map.keys` (`@use 'sass:map'`) |
| `nth`, `length`, `append`, `join`, `index` | `list.nth`, `list.length`, `list.append`, `list.join`, `list.index` |
| `percentage`, `unit`, `unitless`, `comparable`, `ceil`, `floor` | `math.percentage`, `math.unit`, `math.is-unitless`, `math.compatible`, `math.ceil`, `math.floor` |
| `str-index`, `str-slice`, `quote`, `unquote` | `string.index`, `string.slice`, `string.quote`, `string.unquote` |
| `type-of`, `inspect`, `call`, `get-function` | `meta.type-of`, `meta.inspect`, `meta.call`, `meta.get-function` |
| `mix`, `adjust-color`, `scale-color`, `change-color` | `color.mix`, `color.adjust`, `color.scale`, `color.change` |

`min()`, `max()`, `round()`, `abs()` and `clamp()` are CSS functions too; Sass handles them without a module.

## Colours [sass/no-legacy-color-functions]

| Old | New |
| --- | --- |
| `darken($c, 10%)` | `color.scale($c, $lightness: -10%)`, or `$space: oklch` for even steps |
| `lighten($c, 10%)` | `color.scale($c, $lightness: 10%)` |
| `fade-out($c, 0.5)`, `transparentize($c, 0.5)` | `color.adjust($c, $alpha: -0.5)` or `color.change($c, $alpha: 0.5)` |
| `adjust-hue($c, 30deg)` | `color.adjust($c, $hue: 30deg)` |
| `lightness($c)` | `color.channel($c, 'lightness', $space: hsl)` |
| a hover shade that themes change at run time | CSS `color-mix(in oklch, var(--brand) 85%, black)` |

## Division [sass/math-div]

- `math.div($a, $b)` for division; `calc()` keeps its slash as CSS.
- `list.slash($a, $b)` or `#{$a}/#{$b}` when the output needs a slash (`font: #{$size}/#{$line}`).
- Parentheses make Sass divide: `(100% / 3)` stops working in future versions; write `math.div(100%, 3)`.

## Project helpers

| Helper in the profile | What to write | Rule |
| --- | --- | --- |
| `rem-function` (for example Foundation's `rem-calc($values, $base)`, base `$global-font-size`, 16px by default) | `rem-calc(24px)`, `rem-calc(8px 16px)` for shorthands | [css/rem-helper] for raw px, [sass/rem-helper] for hand-made conversions |
| `px-to-rem-build` (a PostCSS plugin such as `postcss-pxtorem`) | px in the source; the build converts | neither rule runs |
| `custom-properties`, `design-tokens` | the existing names, not new `$variables` | [sass/custom-properties-for-themes] |

A project's own helper is usually one function: `@function rem($px, $base: 16px) { @return math.div($px, $base) * 1rem; }`. That body is the only place that divides by the base.

## What plain CSS now covers

| Sass feature | CSS today |
| --- | --- |
| Nesting with `&` | native CSS nesting (Baseline 2023) |
| `$variables` for themes | custom properties [sass/custom-properties-for-themes] |
| `darken()` for hover shades | `color-mix()` |
| Math for fluid sizes | `clamp()`, `min()`, `max()`, `calc()` |
| Partials joined by `@import` | a bundler's CSS imports, `@layer` for order |

Sass still earns its place for loops and maps that generate classes, mixins with arguments, and compile-time functions such as the rem helper.

## Sources

- Sass docs, Breaking change - @import and global built-ins: https://sass-lang.com/documentation/breaking-changes/import/
- Sass docs, @use: https://sass-lang.com/documentation/at-rules/use/
- Sass docs, @forward: https://sass-lang.com/documentation/at-rules/forward/
- Sass docs, @import (plain CSS imports): https://sass-lang.com/documentation/at-rules/import/
- Sass docs, Built-in modules: https://sass-lang.com/documentation/modules/
- Sass docs, Breaking change - color functions: https://sass-lang.com/documentation/breaking-changes/color-functions/
- Sass docs, Breaking change - slash as division: https://sass-lang.com/documentation/breaking-changes/slash-div/
- Sass docs, Breaking change - legacy JS API: https://sass-lang.com/documentation/breaking-changes/legacy-js-api/
- Sass docs, Migrator: https://sass-lang.com/documentation/cli/migrator/
- Sass blog, LibSass is deprecated: https://sass-lang.com/blog/libsass-is-deprecated/
- Foundation for Sites 6 docs, Sass functions (rem-calc): https://get.foundation/sites/docs/sass-functions.html
- npm registry, sass: https://registry.npmjs.org/sass/latest
