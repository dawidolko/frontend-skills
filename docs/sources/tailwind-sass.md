# Tailwind CSS and Sass: sources and candidate rules

Read on 2026-11-11. Primary sources:

- npm registry: `tailwindcss`, `@tailwindcss/vite`, `@tailwindcss/postcss`, `prettier-plugin-tailwindcss`, `sass`, `sass-embedded`, `stylelint-scss` (https://www.npmjs.com/package/<name>; data from https://registry.npmjs.org/<name>)
- Tailwind blog (https://tailwindcss.com/blog): "Tailwind CSS v4.3", May 8 2026
- Tailwind docs: Vite install (https://tailwindcss.com/docs/installation/using-vite), PostCSS install (https://tailwindcss.com/docs/installation/using-postcss), Detecting classes (https://tailwindcss.com/docs/detecting-classes-in-source-files), Styling with utility classes (https://tailwindcss.com/docs/styling-with-utility-classes), Functions and directives (https://tailwindcss.com/docs/functions-and-directives), Theme (https://tailwindcss.com/docs/theme), Upgrade guide (https://tailwindcss.com/docs/upgrade-guide), Compatibility (https://tailwindcss.com/docs/compatibility), States (https://tailwindcss.com/docs/hover-focus-and-other-states), Display / sr-only (https://tailwindcss.com/docs/display), Responsive (https://tailwindcss.com/docs/responsive-design), Dark mode (https://tailwindcss.com/docs/dark-mode), Editor setup (https://tailwindcss.com/docs/editor-setup)
- Sass docs: Breaking changes (https://sass-lang.com/documentation/breaking-changes/), @import and global built-ins (https://sass-lang.com/documentation/breaking-changes/import/), @use (https://sass-lang.com/documentation/at-rules/use/), @forward (https://sass-lang.com/documentation/at-rules/forward/), color functions (https://sass-lang.com/documentation/breaking-changes/color-functions/), slash-div (https://sass-lang.com/documentation/breaking-changes/slash-div/), legacy JS API (https://sass-lang.com/documentation/breaking-changes/legacy-js-api/), mixed declarations (https://sass-lang.com/documentation/breaking-changes/mixed-decls/), @extend (https://sass-lang.com/documentation/at-rules/extend/), migrator (https://sass-lang.com/documentation/cli/migrator/), "LibSass is Deprecated" (https://sass-lang.com/blog/libsass-is-deprecated/)
- stylelint-scss rule list (https://github.com/stylelint-scss/stylelint-scss/blob/master/README.md)

## Version and status (verified 2026-11-11)

| package | latest | published | licence (registry) | note |
|---|---|---|---|---|
| `tailwindcss` | 4.3.5 | 2026-11-06 | MIT | 4.0.0 published 2025-01-21; `v3-lts` tag = 3.4.19 |
| `@tailwindcss/vite` | 4.3.5 | 2026-11-06 | MIT | |
| `@tailwindcss/postcss` | 4.3.5 | 2026-11-06 | MIT | |
| `prettier-plugin-tailwindcss` | 0.8.1 | 2026-07-15 | MIT | repo tailwindlabs/prettier-plugin-tailwindcss (official) |
| `sass` (Dart Sass) | 1.108.2 | 2026-11-11 | MIT | sass-lang.com footer also shows Dart Sass 1.108.2; 1.80.0 (deprecated `@import`) published 2024-10-17 |
| `sass-embedded` | 1.108.2 | 2026-11-11 | MIT | |
| `stylelint-scss` | 7.4.0 | 2026-10-25 | MIT | community org `stylelint-scss`, not the Sass team |

Tailwind v4 browser floor: Chrome 111, Safari 16.4, Firefox 128 (https://tailwindcss.com/docs/compatibility). Projects that must support older browsers stay on v3 (`v3-lts`).

## Detection (for stack detection)

| signal | meaning | source |
|---|---|---|
| `tailwindcss` major 4 in deps; `@tailwindcss/vite` (Vite plugin) or `@tailwindcss/postcss` (in `postcss.config.mjs`) or `@tailwindcss/cli`; a CSS file containing `@import "tailwindcss";`; `@theme {` blocks | Tailwind v4 (CSS-first config) | https://tailwindcss.com/docs/installation/using-vite; https://tailwindcss.com/docs/installation/using-postcss; https://tailwindcss.com/docs/theme |
| `tailwindcss` major 3; `tailwind.config.(js|cjs|mjs|ts)`; `@tailwind base; @tailwind components; @tailwind utilities;` in CSS; `tailwindcss` listed as a PostCSS plugin | Tailwind v3 | https://tailwindcss.com/docs/upgrade-guide ("Removed @tailwind directives", "Using a JavaScript config file") |
| v4 + `@config "…tailwind.config.js"` | v4 still loading a legacy JS config (not auto-detected in v4) | upgrade guide |
| `sass` or `sass-embedded` dep; `*.scss` / `*.sass` files | Dart Sass | https://sass-lang.com/documentation/syntax/ |
| `node-sass` dep | LibSass (deprecated) | https://sass-lang.com/blog/libsass-is-deprecated/ |
| `@use`/`@forward` present vs only `@import` in `.scss` | module system vs legacy | https://sass-lang.com/documentation/breaking-changes/import/ |
| Tailwind v4 and Sass both present | conflict to flag (see `tailwind/no-preprocessor`) | https://tailwindcss.com/docs/compatibility |

## Tailwind CSS

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| tailwind/no-dynamic-class-names | Write every Tailwind class as a complete literal string; map props/state to full class names instead of building them by concatenation or interpolation. | Tailwind scans files as plain text, so `bg-${color}-600` never generates CSS. | https://tailwindcss.com/docs/detecting-classes-in-source-files ("Dynamic class names") | Tailwind 3/4 | static: template literals or string concat producing class fragments like `-${` inside `class`/`className` | `` `bg-${c}-600` `` → `{blue:'bg-blue-600', red:'bg-red-600'}[c]` | – | error |
| tailwind/register-external-sources | Register class sources Tailwind ignores (gitignored paths, `node_modules` UI libs) with `@source`. | Otherwise their classes are missing. | https://tailwindcss.com/docs/detecting-classes-in-source-files ("Which files are scanned", "Explicitly registering sources") | Tailwind 4 | static: UI lib in deps that ships Tailwind classes, no `@source` | – | – | warning |
| tailwind/no-conflicting-utilities | Do not put two utilities that set the same property on one element; expose explicit props for component variants instead of letting callers append classes. | The result depends on CSS order, not class order. | https://tailwindcss.com/docs/styling-with-utility-classes ("Managing style conflicts") | Tailwind | static: same element with `flex grid`, `p-2 p-4` etc. (needs class-group table) | `class="grid flex"` → one of them | – | warning |
| tailwind/reuse-via-components | Remove duplication with loops, framework components or template partials first; use `@apply`/custom CSS in `@layer components` only for small cases or third-party markup. | Official guidance; heavy `@apply` recreates the problems utilities avoid. | https://tailwindcss.com/docs/styling-with-utility-classes ("Managing duplication", "Using components", "Using custom CSS"); https://tailwindcss.com/docs/functions-and-directives (`@apply`) | Tailwind | static: count `@apply` lines; flag files where most rules are `@apply` | `.btn { @apply ... }` used once → inline utilities | – | info |
| tailwind/reference-in-component-styles | In Vue/Svelte/Astro `<style>` blocks or CSS modules that use `@apply`/`@variant`, add `@reference "…/app.css"` (or use theme CSS variables directly). | Each block is processed separately and has no theme otherwise. | https://tailwindcss.com/docs/functions-and-directives (`@reference`); https://tailwindcss.com/docs/compatibility ("Vue, Svelte, and Astro") | Tailwind 4 | static: `@apply` in `<style>` without `@reference` | – | – | error |
| tailwind/avoid-component-style-blocks | Prefer utilities in markup over `<style>` blocks and CSS modules in Tailwind projects. | Each block is a separate Tailwind run (slower builds, missing theme). | https://tailwindcss.com/docs/compatibility ("CSS modules", "Vue, Svelte, and Astro") | Tailwind 4 | static: count style blocks in Tailwind projects | – | – | info |
| tailwind/no-preprocessor | Do not combine Tailwind v4 with Sass, Less or Stylus; use native CSS nesting/variables and Tailwind's own import bundling. | v4 is not designed to run with preprocessors. | https://tailwindcss.com/docs/compatibility ("Sass, Less, and Stylus") | Tailwind 4 | static: `tailwindcss@4` and `sass` deps together, or `@import "tailwindcss"` in a `.scss` file | `main.scss` → `main.css` | – | warning |
| tailwind/v4-import-not-directives | In v4 load Tailwind with `@import "tailwindcss";`, not `@tailwind` directives; run `npx @tailwindcss/upgrade` to migrate from v3. | Directives were removed. | https://tailwindcss.com/docs/upgrade-guide ("Removed @tailwind directives", "Using the upgrade tool") | Tailwind 4 | static: `@tailwind` in CSS with v4 dep | – | – | error |
| tailwind/v4-renamed-utilities | Use v4 names: `outline-hidden` where v3 used `outline-none`, `bg-(--var)` for CSS-variable shorthand, trailing `!` for important, CSS variables instead of `theme()`. | Old forms changed meaning or are deprecated. | https://tailwindcss.com/docs/upgrade-guide ("Renamed outline utility", "Variables in arbitrary values", "The important modifier", "Using the theme() function") | Tailwind 4 | static: `bg-[--`, leading `!` utilities, `theme(colors.` | `focus:outline-none` → `focus:outline-hidden` | – | warning |
| tailwind/theme-tokens | Define design tokens as `@theme` variables (e.g. `--color-brand-500`) instead of arbitrary values repeated in markup. | Tokens generate utilities and CSS variables in one place. | https://tailwindcss.com/docs/theme | Tailwind 4 | static: same arbitrary value `[#abc123]` repeated > N times | `bg-[#0a7]` ×10 → `--color-brand-500` + `bg-brand-500` | – | info |
| tailwind/mobile-first | Write unprefixed utilities for small screens and add `sm:`/`md:`… for larger ones; do not use `sm:` to target phones. | Breakpoint prefixes mean "this width and up". | https://tailwindcss.com/docs/responsive-design ("Working mobile-first") | Tailwind | manual (pattern: `sm:` value that undoes a later `md:`) | `sm:text-center` for phones → `text-center md:text-left` | – | info |
| tailwind/hover-touch | Do not rely on `hover:` to reveal essential content or actions; v4 applies hover only on devices that support hover. | Touch users never see it. | https://tailwindcss.com/docs/upgrade-guide ("Hover styles on mobile") | Tailwind 4 | static: `hidden group-hover:block` patterns (manual review) | – | – | warning |
| tailwind/prettier-class-order | Sort classes with the official `prettier-plugin-tailwindcss`. | Consistent order, easier review; no runtime effect. | https://tailwindcss.com/docs/editor-setup ("Class sorting with Prettier") | Tailwind | static: plugin in Prettier config | – | `prettier-plugin-tailwindcss@0.8.1`, MIT (npm); size irrelevant (dev only) | info |

### Tailwind accessibility helpers

Helps you work to WCAG 2.2 AA; these utilities help but do not check anything by themselves.

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| tailwind/sr-only-labels | Use `sr-only` (not `hidden`) for text that must stay available to screen readers, such as icon-button labels. | `hidden` removes it from the accessibility tree. | https://tailwindcss.com/docs/display ("sr-only") | Tailwind | static: icon-only `<button>`/`<a>` with no text and no `sr-only` span or `aria-label` | `<span class="hidden">Settings</span>` → `class="sr-only"` | – | error |
| tailwind/focus-visible-ring | Never remove focus styles without a replacement; pair `outline-hidden` with a `focus-visible:` ring/outline. | Keyboard users need a visible focus indicator. | https://tailwindcss.com/docs/hover-focus-and-other-states (`:focus-visible`); https://tailwindcss.com/docs/upgrade-guide (outline-none vs outline-hidden) | Tailwind | static: `outline-none`/`outline-hidden` without any `focus-visible:` or `focus:` style on same element | `focus:outline-none` → `focus-visible:outline-2 focus-visible:outline-offset-2` | – | error |
| tailwind/motion-safe | Wrap non-essential animation/transition utilities in `motion-safe:` (or undo with `motion-reduce:`). | Respects `prefers-reduced-motion`. | https://tailwindcss.com/docs/hover-focus-and-other-states ("prefers-reduced-motion") | Tailwind | static: `animate-*` (except spinners) without `motion-safe:`/`motion-reduce:` | `animate-bounce` → `motion-safe:animate-bounce` | – | warning |
| tailwind/forced-colors | Check custom controls (e.g. `appearance-none` inputs, color-only states) in forced-colors mode and use `forced-colors:` variants to restore them. | Forced-colors mode replaces your palette. | https://tailwindcss.com/docs/hover-focus-and-other-states ("forced-colors") | Tailwind | static: `appearance-none` on inputs without `forced-colors:` (heuristic); manual test | `appearance-none` → `appearance-none forced-colors:appearance-auto` | – | info |
| tailwind/contrast-more | Consider `contrast-more:` variants for faint borders/placeholders. | Users can request more contrast. | https://tailwindcss.com/docs/hover-focus-and-other-states ("prefers-contrast") | Tailwind | manual | – | – | info |
| tailwind/dark-mode-pairs | When adding `dark:` styles, give every light colour utility a dark counterpart and check contrast in both. | One utility never covers both modes. | https://tailwindcss.com/docs/styling-with-utility-classes (dark mode note); https://tailwindcss.com/docs/dark-mode | Tailwind | runtime: axe `color-contrast` in both schemes | – | – | info |

## Sass

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| sass/no-import | Replace Sass `@import` with `@use` (to consume) and `@forward` (to re-export). | `@import` is deprecated since Dart Sass 1.80.0 (2024-10-17) and slated for removal in Dart Sass 3.0.0; it pollutes one global namespace and recompiles files. | https://sass-lang.com/documentation/breaking-changes/import/ | Dart Sass | static: `@import` in `.scss`/`.sass` that is not a plain-CSS import (`url(`, `.css`, `http`) | `@import 'vars';` → `@use 'vars';` | `sass-migrator module --migrate-deps entry.scss` | warning |
| sass/no-global-builtins | Call built-in functions through their modules (`math.div`, `color.adjust`, `map.get`, `string.index`…) after `@use "sass:<module>"`. | Global built-in functions are deprecated with `@import`. | https://sass-lang.com/documentation/breaking-changes/import/; stylelint-scss `scss/no-global-function-names` | Dart Sass ≥1.80 | static: lint rule | `map-get($m, k)` → `map.get($m, k)` | `sass-migrator module --built-in-only` | warning |
| sass/use-first | Put `@use` rules before any other rules except `@forward`. | Required by the language. | https://sass-lang.com/documentation/at-rules/use/ | Dart Sass | static: compiler error | – | – | error |
| sass/keep-namespaces | Keep `@use` namespaces (default last URL segment or a short `as` alias) and avoid `as *` except for small, owned token files. | Namespaces show where members come from. | https://sass-lang.com/documentation/at-rules/use/ ("Choosing a Namespace"); stylelint-scss `scss/at-use-no-unnamespaced` | Dart Sass | static: `@use "..." as *` | `@use 'tokens' as *` → `@use 'tokens'` | – | info |
| sass/configure-with-default | Make library variables configurable with `!default` and configure them with `@use "lib" with (...)`, not by setting globals before an import. | That is the module-system way to configure. | https://sass-lang.com/documentation/at-rules/use/ ("Configuration") | Dart Sass | static: variable assigned then `@import` | – | – | info |
| sass/private-members | Mark module-internal members with a leading `-` or `_`. | They are not exported. | https://sass-lang.com/documentation/at-rules/use/ ("Private Members"); stylelint-scss `scss/no-unused-private-members` | Dart Sass | static | – | – | info |
| sass/math-div | Use `math.div()` (or `list.slash()`) instead of `/` for division. | `/` is becoming a list separator, as in CSS. | https://sass-lang.com/documentation/breaking-changes/slash-div/ | Dart Sass ≥1.33 | static: `/` between Sass numbers/variables outside `calc()` (compiler deprecation warning) | `$a / 2` → `math.div($a, 2)` | `sass-migrator division` | warning |
| sass/color-module-functions | Replace deprecated color functions (`lighten`, `darken`, `saturate`, `desaturate`, `adjust-hue`, `opacify`, `fade-in`…, and channel getters like `red()`) with `color.adjust`/`color.scale` and `color.channel(..., $space: ...)`. | Old functions assume one sRGB gamut and are deprecated since Dart Sass 1.79.0. | https://sass-lang.com/documentation/breaking-changes/color-functions/ | Dart Sass ≥1.79 | static: grep function names | `darken($c, 10%)` → `color.adjust($c, $lightness: -10%, $space: hsl)` (or `color.scale`) | – | warning |
| sass/declarations-before-nested | Put declarations before nested rules in a style rule (or wrap later ones in `& {}`). | Sass now follows CSS ordering for mixed declarations, which can change output. | https://sass-lang.com/documentation/breaking-changes/mixed-decls/ | Dart Sass ≥1.77.7 | static: compiler deprecation warning | – | – | info |
| sass/extend-semantic-only | Use `@extend` only for real semantic relationships (prefer placeholder selectors `%name`) and mixins for plain reusable chunks. | Avoids cascade surprises and selector bloat. | https://sass-lang.com/documentation/at-rules/extend/ ("Extends or Mixins?", "Placeholder Selectors"); stylelint-scss `scss/at-extend-no-missing-placeholder` | Sass | static: `@extend .class` (non-placeholder) | `@extend .btn` → `@extend %btn` or `@include btn` | – | info |
| sass/modern-js-api | Use the modern JS API (`compile`/`compileAsync`/`compileString`) and modern bundler options, not `render`/`renderSync`. | The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0. | https://sass-lang.com/documentation/breaking-changes/legacy-js-api/ | Build tooling | static: `sass.render(`/`renderSync(`; bundler config with `api: 'legacy'` (Not verified per bundler) | – | – | warning |
| sass/no-libsass | Replace `node-sass` (LibSass) with `sass` or `sass-embedded` (Dart Sass). | LibSass and Node Sass are deprecated and lack the module system. | https://sass-lang.com/blog/libsass-is-deprecated/ | any | static: `node-sass` in deps | `node-sass` → `sass` | `sass@1.108.2` or `sass-embedded@1.108.2`, MIT (npm) | error |
| sass/fix-deprecations-early | Treat Dart Sass deprecation warnings as work items (optionally `fatalDeprecations` in CI); Dart Sass warns at least three months before a breaking change. | Avoids surprise breakage on upgrade. | https://sass-lang.com/documentation/breaking-changes/ | Dart Sass | runtime: build log | – | – | info |

## Official tooling

- Tailwind: `prettier-plugin-tailwindcss` (class order) and Tailwind CSS IntelliSense (VS Code, includes linting) are official (https://tailwindcss.com/docs/editor-setup). Upgrade tool: `npx @tailwindcss/upgrade`. No official ESLint plugin from Tailwind Labs was found in the docs read.
- Sass: `sass-migrator` (`module`, `division`, plus `--built-in-only`) is official (https://sass-lang.com/documentation/cli/migrator/). Linting is via the community `stylelint-scss` 7.4.0: `scss/no-global-function-names`, `scss/at-use-no-unnamespaced`, `scss/at-use-no-redundant-alias`, `scss/load-no-partial-leading-underscore`, `scss/load-partial-extension`, `scss/no-duplicate-load-rules`, `scss/at-extend-no-missing-placeholder`, `scss/no-unused-private-members`, `scss/partial-no-import`, `scss/function-color-channel`, `scss/dollar-variable-default` (https://github.com/stylelint-scss/stylelint-scss). To ban `@import`, use core stylelint `at-rule-disallowed-list: ["import"]` (Not verified in today's stylelint docs).

## AI-agent resources

- Tailwind: https://tailwindcss.com/llms.txt returned 404 on 2026-11-11; no official MCP server or AI rules page found in the docs read.
- Sass: https://sass-lang.com/llms.txt returned 404; none found.

## Notes for skill authors

- Short skill: dynamic class names, `sr-only`, focus-visible, motion-safe, v4 vs v3 detection, Sass `@use`/no-global-builtins/math.div/no node-sass. Reference file: renamed utilities, `@reference`, colour function table, stylelint names.
- `@apply` overuse is a judgement call; keep as info and never auto-rewrite.
- Detecting dynamic class names statically is noisy (template literals that build full class names are fine); flag only fragments ending/starting with `-` next to an interpolation.
- Tailwind v4 minors ship often (4.3 in May 2026); Tailwind Labs joined Shopify (blog, September 9 2026) — recheck tooling/licensing news. Dart Sass 3.0.0 (removal of `@import`) may land any time after October 2026; 2.0.0 removes the legacy JS API. Recheck each run.

## Not verified

- min+gzip sizes (not relevant for build-time tools; not checked).
- Whether Vite's Sass integration defaults to the modern compiler API in Vite 8 (not read on vite.dev).
- Core stylelint `at-rule-disallowed-list` behaviour today.
- Exact Tailwind v3 config filenames accepted by v3 (only `tailwind.config.js` seen in v4 upgrade guide; `.cjs/.mjs/.ts` from memory).
- Angular `angular.json` `inlineStyleLanguage: "scss"` as a Sass signal (not read).
