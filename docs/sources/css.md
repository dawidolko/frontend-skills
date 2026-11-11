# CSS: sources and candidate rules

Read on 2026-11-11. Primary sources:

- web-features data (the Baseline source of truth), npm package `web-features@3.45.0`, published 2026-11-02, licence Apache-2.0: https://www.npmjs.com/package/web-features; explorer: https://web-platform-dx.github.io/web-features-explorer/ (per feature: `/features/<id>/`); also https://webstatus.dev/
- MDN Web Docs, CSS reference: https://developer.mozilla.org/en-US/docs/Web/CSS (individual pages linked per row)
- web.dev: Animations guide https://web.dev/articles/animations-guide; Optimize resource loading https://web.dev/learn/performance/optimize-resource-loading; Learn CSS https://web.dev/learn/css
- WCAG 2.2 Understanding docs and Techniques: https://www.w3.org/WAI/WCAG22/Understanding/ (2.4.7, 1.4.12, 2.3.3, 2.2.2), F78 https://www.w3.org/WAI/WCAG22/Techniques/failures/F78, C39 https://www.w3.org/WAI/WCAG22/Techniques/css/C39
- W3Schools: CSS Syntax https://www.w3schools.com/css/css_syntax.asp; How To https://www.w3schools.com/css/css_howto.asp; HTML Style Guide (has a "Using Style Sheets" part) https://www.w3schools.com/html/html5_syntax.asp; !important https://www.w3schools.com/css/css_important.asp; Specificity Hierarchy https://www.w3schools.com/css/css_specificity_hierarchy.asp; Optimization https://www.w3schools.com/css/css_performance.asp; Accessibility https://www.w3schools.com/css/css_accessibility.asp
- BEM (official site): https://bem.info/en/methodology/quick-start/ (note: the old `getbem.com` domain now redirects to a domain-sale page; do not link it)
- Tailwind CSS, "Styling with utility classes": https://tailwindcss.com/docs/styling-with-utility-classes
- CSS Modules spec repo: https://github.com/css-modules/css-modules (docs/naming.md, docs/composition.md)
- Stylelint rule list: https://stylelint.io/user-guide/rules/ ; Autoprefixer: https://github.com/postcss/autoprefixer

Baseline words used below: **Widely** = Baseline Widely available (web-features `baseline: "high"`), **Newly** = Baseline Newly available (`"low"`), **Limited** = not Baseline (`false`). Dates are the web-features `baseline_low_date` / `baseline_high_date`.

## Baseline status of the features named in this file (web-features 3.45.0, read 2026-11-11)

This changes every few weeks. Re-read the package (or the explorer) before shipping a skill; never hard-code these in a rule without a "last checked" date.

| feature | web-features id | status | Newly since | Widely since | note |
|---|---|---|---|---|---|
| Flexbox | `flexbox` | Widely | 2015-09-30 | 2018-03-30 | |
| Flexbox `gap` | `flexbox-gap` | Widely | 2021-04-26 | 2023-10-26 | |
| Grid | `grid` | Widely | 2017-10-17 | 2020-04-17 | |
| Subgrid | `subgrid` | Widely | 2023-09-15 | 2026-03-15 | |
| Container size queries | `container-queries` | Widely | 2023-02-14 | 2025-08-14 | no polyfill needed |
| Container style queries | `container-style-queries` | Newly | 2026-05-19 | – | |
| Name-only container queries | `container-name-queries` | Newly | 2026-05-07 | – | |
| Container scroll-state queries | `container-scroll-state-queries` | Limited | – | – | |
| Cascade layers (`@layer`) | `cascade-layers` | Widely | 2022-03-14 | 2024-09-14 | |
| `:is()` | `is` | Widely | 2021-01-21 | 2023-07-21 | |
| `:where()` | `where` | Widely | 2021-01-21 | 2023-07-21 | |
| `:has()` | `has` | Widely | 2023-12-19 | 2026-06-19 | |
| Nesting | `nesting` | Widely | 2023-12-11 | 2026-06-11 | |
| Custom properties | `custom-properties` | Widely | 2017-04-05 | 2019-10-05 | |
| `@property` (registered custom properties) | `registered-custom-properties` | Newly | 2024-07-09 | – | |
| Logical properties | `logical-properties` | Widely | 2021-09-20 | 2024-03-20 | |
| `color-mix()` | `color-mix` | Widely | 2023-05-09 | 2025-11-09 | |
| Oklab / OkLCh | `oklab` | Widely | 2023-05-09 | 2025-11-09 | |
| Relative color syntax | `relative-color` | Newly | 2024-09-16 | – | |
| `light-dark()` | `light-dark` | Newly | 2024-05-13 | – | |
| `color-scheme` | `color-scheme` | Widely | 2022-02-03 | 2024-08-03 | |
| `contrast-color()` | `contrast-color` | Newly | 2026-04-10 | – | |
| `@scope` | `scope` | Newly | 2026-03-24 | – | |
| View transitions (same-document) | `view-transitions` | Newly | 2025-10-14 | – | |
| Cross-document view transitions | `cross-document-view-transitions` | Limited | – | – | no Firefox in data |
| Anchor positioning | `anchor-positioning` | Limited | – | – | explorer lists only Safari 27 as supporting the whole feature; partial engines exist, check MDN per property |
| Scroll-driven animations | `scroll-driven-animations` | Newly | 2026-10-27 | – | became Baseline with Firefox 159; very recent |
| `text-wrap: balance` | `text-wrap-balance` | Newly | 2024-05-13 | – | |
| `text-wrap: pretty` | `text-wrap-pretty` | Limited | – | – | no Firefox in data |
| `field-sizing` | `field-sizing` | Newly | 2026-06-16 | – | |
| `@starting-style` | `starting-style` | Newly | 2024-08-06 | – | |
| `transition-behavior` | `transition-behavior` | Newly | 2024-08-06 | – | |
| `interpolate-size` / `calc-size()` | `interpolate-size`, `calc-size` | Limited | – | – | |
| `if()` | `if` | Limited | – | – | |
| `sibling-index()` / `sibling-count()` | `sibling-count` | Newly | 2026-08-18 | – | |
| `min()`, `max()`, `clamp()` | `min-max-clamp` | Widely | 2020-07-28 | 2023-01-28 | |
| Media query range syntax | `media-query-range-syntax` | Widely | 2023-03-27 | 2025-09-27 | |
| `:focus-visible` | `focus-visible` | Widely | 2022-03-14 | 2024-09-14 | |
| `accent-color` | `accent-color` | Limited | – | – | data lists Safari 26.2 but no Chrome Android; re-check |
| Individual transform properties | `individual-transforms` | Widely | 2022-08-05 | 2025-02-05 | |
| `aspect-ratio` | `aspect-ratio` | Widely | 2021-09-20 | 2024-03-20 | |
| `prefers-reduced-motion` | `prefers-reduced-motion` | Widely | 2020-01-15 | 2022-07-15 | |
| `prefers-color-scheme` | `prefers-color-scheme` | Widely | 2020-01-15 | 2022-07-15 | |
| `prefers-contrast` | `prefers-contrast` | Widely | 2022-05-31 | 2024-11-30 | |
| Forced colors (`forced-colors`, `forced-color-adjust`) | `forced-colors` | Widely | 2022-09-12 | 2025-03-12 | |
| `content-visibility` | `content-visibility` | Newly | 2025-09-15 | – | |
| `@import` | `import` | Widely | 2015-07-29 | 2018-01-29 | support is not the issue; loading cost is |

Source for every row: `data.json` in https://registry.npmjs.org/web-features/-/web-features-3.45.0.tgz, cross-checked on the explorer for `anchor-positioning` and `scroll-driven-animations`.

## Syntax and formatting (W3Schools conventions, restated)

Severity: `css/no-space-before-unit` error; the rest info (a formatter such as Prettier settles them; do not spend audit lines on them).

| id | rule (own words, one sentence) | why | source (name, URL, section/criterion) | applies to | check | bad → good | light library |
|---|---|---|---|---|---|---|---|
| css/no-space-before-unit | Write a number and its unit together with no space between them. | `20 px` is not a valid length, so the whole declaration is dropped. | W3Schools How To, https://www.w3schools.com/css/css_howto.asp | CSS | static: regex `\d\s+(px\|em\|rem\|%\|vw\|vh)\b` inside a value | `margin-left: 20 px` → `margin-left: 20px` | – |
| css/rule-layout | Put the opening brace on the selector line after one space, indent declarations by two spaces, and put the closing brace alone on its own line; a very short rule may sit on one line. | Consistent, diff-friendly code. | W3Schools HTML Style Guide, "Using Style Sheets", https://www.w3schools.com/html/html5_syntax.asp | CSS | static (formatter) | `p{color:red}` across many props → multi-line block | – |
| css/trailing-semicolon | End every declaration with a semicolon, including the last in the block. | Adding a line later cannot silently merge two declarations. | W3Schools HTML Style Guide, "Using Style Sheets"; CSS Syntax https://www.w3schools.com/css/css_syntax.asp | CSS | static: last declaration without `;` | `color:red}` → `color:red;}` | – |
| css/quote-only-when-needed | Quote a value only when it contains spaces (for example a multi-word font family) and never quote generic keywords. | Quoting a keyword like `"sans-serif"` turns it into a family name that does not exist. | W3Schools HTML Style Guide, "Using Style Sheets"; MDN font-family https://developer.mozilla.org/en-US/docs/Web/CSS/font-family | CSS | static: quoted generic family | `font-family: "sans-serif"` → `font-family: "Open Sans", sans-serif` | – |
| css/file-naming | Name stylesheets in lower case with a `.css` extension. | Some servers treat file names as case-sensitive. | W3Schools HTML Style Guide, "File Extensions", "Use Lower Case File Names" | any | static: file names | `Main.CSS` → `main.css` | – |
| css/no-link-type | Link stylesheets with a plain `<link rel="stylesheet">`; the `type="text/css"` attribute is not needed. | Less noise; it is the default. | W3Schools HTML Style Guide, "Using Style Sheets" | HTML | static: `<link ... type="text/css">` | drop `type` | – |
| css/short-lines | Keep CSS lines short enough to read without horizontal scrolling. | Readability in review. | W3Schools HTML Style Guide, "Avoid Long Code Lines" | CSS | static (formatter print width) | – | – |
| css/shorthand-with-care | Use shorthands to set every sub-value at once, but remember a shorthand resets the sub-values you leave out. | W3Schools recommends shorthands for size; a shorthand written after a longhand silently overwrites it. | W3Schools Optimization #5, https://www.w3schools.com/css/css_performance.asp; MDN shorthand properties https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties | CSS | static: stylelint `declaration-block-no-redundant-longhand-properties`, `shorthand-property-no-redundant-values` | four `margin-*` → `margin: 10px 20px` | – |

## Cascade, specificity, layers

Severity: `css/important-sprawl` warning, `css/no-id-selectors` warning, `css/selector-depth` warning, `css/import-position` error, others info.

| id | rule (own words, one sentence) | why | source (name, URL, section/criterion) | applies to | check | bad → good | light library |
|---|---|---|---|---|---|---|---|
| css/important-sprawl | Use `!important` only for utility classes, user-preference overrides or styles you cannot otherwise reach (third-party inline styles), not to win specificity fights. | Each use can only be beaten by another `!important`, so it escalates. | W3Schools !important, https://www.w3schools.com/css/css_important.asp; MDN https://developer.mozilla.org/en-US/docs/Web/CSS/important | CSS | static: count `!important` per file; stylelint `declaration-no-important` (too strict as error; report a count) | `.btn{color:red!important}` → raise via `@layer` order or a clearer selector | – |
| css/no-id-selectors | Do not style by ID; use classes. | An ID weighs 1-0-0 and beats any number of classes, making overrides hard; BEM also bans ID and tag selectors. | W3Schools Specificity Hierarchy, https://www.w3schools.com/css/css_specificity_hierarchy.asp; BEM quick start https://bem.info/en/methodology/quick-start/ | CSS | static: stylelint `selector-max-id: 0` | `#nav a` → `.nav__link` | – |
| css/selector-depth | Keep selectors short (about three compound parts or fewer) and avoid chains tied to DOM structure. | Long chains raise specificity and break when markup moves; W3Schools frames it as speed, the bigger cost is maintenance. | W3Schools Optimization #1; MDN Specificity https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity | CSS | static: stylelint `selector-max-compound-selectors: 3`, `selector-max-specificity` | `body #navlist ul li a.button:hover` → `.button:hover` | – |
| css/layer-order-first | Declare the full layer order once, at the top of the entry stylesheet (for example `@layer reset, base, components, utilities;`). | Layer priority follows the order names first appear, not where rules sit, so one statement makes it explicit. | MDN @layer, https://developer.mozilla.org/en-US/docs/Web/CSS/@layer (Widely 2024-09-14) | CSS | static: `@layer x {}` blocks with no prior order statement | scattered `@layer` blocks → one order statement first | – |
| css/layer-third-party | Put resets and third-party CSS into low layers (e.g. `@import url(x.css) layer(vendor);`) so your own code wins without extra specificity. | Later layers beat earlier ones regardless of specificity. | MDN @layer (`@import ... layer()`) | CSS | manual / static: vendor CSS imported unlayered | vendor sheet unlayered → `layer(vendor)` | – |
| css/unlayered-wins | Know that normal unlayered styles beat every layered style, while for `!important` the order flips (earlier layers win and layered important beats unlayered important). | Mixing layered framework CSS with unlayered app CSS gives surprising winners. | MDN @layer; MDN Cascade https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade | CSS | manual (explain in skill) | – | – |
| css/where-for-defaults | Wrap reset and base selectors in `:where()` so they have zero specificity and any component class overrides them. | `:where()` always counts 0; `:is()` takes the weight of its heaviest argument. | MDN :where https://developer.mozilla.org/en-US/docs/Web/CSS/:where, :is https://developer.mozilla.org/en-US/docs/Web/CSS/:is (both Widely 2023-07-21) | CSS | manual | `ul[class] {…}` reset → `:where(ul[class]) {…}` | – |
| css/is-heavy-argument | Do not put an ID or other heavy selector inside `:is()` unless you want every match to carry that weight. | `:is(#a, .b) p` gives `.b p` ID-level specificity too. | MDN :is | CSS | static: `:is(` containing `#` | `:is(#hero,.card) h2` → `:where(#hero,.card) h2` or split | – |
| css/import-position | Place any `@import` before all other rules (only `@charset` and `@layer` statements may come first). | A late `@import` is ignored. | MDN @import, https://developer.mozilla.org/en-US/docs/Web/CSS/@import | CSS | static: stylelint `no-invalid-position-at-import-rule` | `@import` after a rule → move to top | – |
| css/no-inline-style | Keep static styles out of `style` attributes; reserve inline style for values computed at runtime (ideally just setting a custom property). | Inline styles beat stylesheets, cannot use media queries or states, and bloat HTML. | W3Schools Optimization #3; W3Schools Specificity Hierarchy | HTML / JSX | static: `style="..."` / `style={{…}}` with literal values only | `<p style="color:blue">` → class; dynamic: `style="--progress: 40%"` | – |

## Architecture and naming (neutral; pick one per project)

Severity: info. Only report when the project already shows a convention and a file breaks it.

| id | rule (own words, one sentence) | why | source (name, URL, section/criterion) | applies to | check | bad → good | light library |
|---|---|---|---|---|---|---|---|
| css/one-naming-convention | Follow the single class-naming approach the project already uses (BEM, utility-first, CSS Modules or another) and enforce it with a pattern lint. | Mixed conventions hide ownership and cause collisions. | Stylelint `selector-class-pattern`, https://stylelint.io/user-guide/rules/ | CSS | static: detect convention, then `selector-class-pattern` | – | stylelint@18.0.0, MIT (npm), dev-only |
| css/bem-structure | In BEM, name a block by purpose, join elements with `__`, keep element names one level deep (no `block__a__b`), and join modifiers with a single `_` (the widely used `--` variant is acceptable if the project uses it consistently). | Flat names keep blocks movable; bem.info's own separator for modifiers is `_`. | BEM quick start, https://bem.info/en/methodology/quick-start/ | CSS / HTML | static: class matching `__\w+__` | `.menu__list__item` → `.menu__item` | – |
| css/bem-block-no-outer-geometry | A BEM block should not set its own outer margin or position; let the parent place it (a "mix"). | Keeps the block reusable in any context. | BEM quick start, "Block" | CSS | manual | `.card{margin-top:2rem}` → `.page__card{margin-top:2rem}` | – |
| css/utility-first-extract | With utility classes, remove duplication by looping or extracting a component/partial, and write custom CSS (using theme variables) only for small repeated pieces. | Keeps one source of truth while staying utility-first. | Tailwind "Styling with utility classes", https://tailwindcss.com/docs/styling-with-utility-classes | Tailwind | manual | same 15-class string in 6 files → one component | – |
| css/utility-literal-classes | Write utility class names as complete literal strings in source, choosing between whole strings rather than building names from fragments. | Tailwind finds classes by scanning files as text; assembled names are not generated. | Tailwind "Styling with utility classes" (class detection and the size-map example) | Tailwind | static: template literal like `` `text-${c}-500` `` | `` `bg-${color}-600` `` → `{red:'bg-red-600',…}[color]` | – |
| css/modules-camelcase | In CSS Modules, name local classes in camelCase. | Accessed as `styles.className`; kebab-case needs bracket access. | CSS Modules docs/naming.md, https://github.com/css-modules/css-modules/blob/master/docs/naming.md | CSS Modules | static: `.module.css` class with `-` | `.card-title` → `.cardTitle` | – |
| css/modules-composes-first | Put `composes` before other declarations and only compose single local class names. | That is the documented constraint. | CSS Modules docs/composition.md, https://github.com/css-modules/css-modules/blob/master/docs/composition.md | CSS Modules | static: `composes` after another declaration | – | – |
| css/scope-progressive | Use `@scope` only as progressive enhancement until it is Widely available. | Newly available since 2026-03-24. | MDN @scope https://developer.mozilla.org/en-US/docs/Web/CSS/@scope; web-features `scope` | CSS | static: `@scope` present | – | – |

## Layout

Severity: `css/no-float-layout` warning; `css/container-type-inline` warning; others info.

| id | rule (own words, one sentence) | why | source (name, URL, section/criterion) | applies to | check | bad → good | light library |
|---|---|---|---|---|---|---|---|
| css/no-float-layout | Build page and component layout with flexbox or grid, keeping `float` for wrapping text around media. | Floats need clearfix hacks and do not align or reorder well; flex and grid are Widely available. | MDN Grid https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout; web-features `grid`, `flexbox` | CSS | static: `float:` together with percentage widths on siblings / `.clearfix` | float columns → `display:grid` | – |
| css/gap-over-margins | Space flex and grid children with `gap` instead of margins on children. | No first/last-child exceptions; flex `gap` is Widely (2023-10-26). | MDN gap https://developer.mozilla.org/en-US/docs/Web/CSS/gap | CSS | static: `> * + *` margin hacks inside flex/grid | `.row>*+*{margin-left:1rem}` → `.row{gap:1rem}` | – |
| css/subgrid-alignment | Use `grid-template-rows/columns: subgrid` when nested items (card titles, footers) must line up across siblings. | Avoids fixed heights; Widely since 2026-03-15. | MDN Subgrid https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid | CSS | manual | fixed `height` on card titles → subgrid rows | – |
| css/container-queries-components | Make reusable components respond to their container with `@container`, keeping media queries for page-level layout. | A card in a sidebar and in main content needs different layouts at the same viewport width; Widely since 2025-08-14, so no polyfill. | MDN Container queries https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries | CSS | manual | – | not needed: `container-query-polyfill@1.0.2` (Apache-2.0, 10.1 kB min+gz per bundlephobia) says it is in maintenance mode since Nov 2022 |
| css/container-type-inline | Use `container-type: inline-size` unless you really need to query height; `size` stops the element from taking its height from content. | A `size` container with no set height collapses. | MDN container-type, https://developer.mozilla.org/en-US/docs/Web/CSS/container-type | CSS | static: `container-type: size` without `height`/`block-size` on same rule | `container-type:size` → `inline-size` | – |
| css/logical-properties | Prefer logical properties (`margin-inline-start`, `padding-block`, `inset-inline-end`, `inline-size`) over physical ones when the site has, or may get, right-to-left or vertical text. | They follow writing direction automatically; Widely since 2024-03-20. | MDN Logical properties, https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values | CSS | static: physical left/right props in a project with `dir="rtl"` or i18n setup | `margin-left` → `margin-inline-start` | – |

## Modern features (use with the right fallback)

Severity: `css/limited-needs-fallback` warning; others info.

| id | rule (own words, one sentence) | why | source (name, URL, section/criterion) | applies to | check | bad → good | light library |
|---|---|---|---|---|---|---|---|
| css/limited-needs-fallback | Any feature that is Limited (or Newly, if the project's browser targets go older) must sit behind `@supports` or degrade harmlessly. | Unsupported declarations are dropped; layout-critical ones then break. | web-features data (table above); MDN @supports https://developer.mozilla.org/en-US/docs/Web/CSS/@supports | CSS | static: map properties/at-rules to web-features ids and compare with the project's browserslist | `position-anchor` with no fallback → `@supports (anchor-name: --a) {…}` | – |
| css/nesting-native-syntax | With native nesting, never build class names by suffix (`&__el`, `&-x`); write the full selector or use `&.mod`, `& .child`. | Native nesting has no concatenation; the rule block is dropped. | MDN Using CSS nesting, https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting (Widely 2026-06-11) | CSS (not Sass) | static: `&__`, `&-` in `.css` files | `&__title` → `.card__title` | – |
| css/nesting-depth | Keep nesting to about three levels. | Deep nesting recreates long, high-specificity selectors; `&` takes `:is()`-style specificity. | MDN Using CSS nesting; stylelint `max-nesting-depth` | CSS / Sass | static: `max-nesting-depth: 3` | – | – |
| css/tokens-as-custom-properties | Define design tokens (colours, spacing, radii, type scale) as custom properties on `:root` and reference them with `var()`. | One place to theme; works at runtime and in dark mode. | MDN Using custom properties, https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties | CSS | static: same hex literal repeated N times | `#1a73e8` ×20 → `var(--color-primary)` | – |
| css/property-for-typed-vars | Register a custom property with `@property` (syntax, inherits, initial-value) when you need to animate it or want a typed fallback. | Unregistered custom properties are strings and cannot interpolate; Newly since 2024-07-09. | MDN @property, https://developer.mozilla.org/en-US/docs/Web/CSS/@property | CSS | manual | – | – |
| css/has-for-parent-state | Use `:has()` for parent or sibling state (e.g. form group with invalid input) instead of toggling classes from JavaScript. | Widely since 2026-06-19. | MDN :has, https://developer.mozilla.org/en-US/docs/Web/CSS/:has | CSS | manual | JS adds `.has-error` → `.field:has(:user-invalid)` | – |
| css/oklch-palette | Define palette colours in `oklch()` and derive hover/active/tints with `color-mix()`; still check every text/background pair for contrast. | Perceptually even lightness steps; both Widely since 2025-11-09. | MDN oklch https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch; color-mix https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix | CSS | manual; contrast via axe `color-contrast` | hand-picked hex shades → `color-mix(in oklch, var(--brand) 80%, black)` | – |
| css/relative-color-fallback | Give a plain colour fallback before relative colour syntax (`oklch(from var(--c) l c h / 50%)`). | Newly since 2024-09-16. | MDN relative colors https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors; web-features `relative-color` | CSS | static: `from` inside colour function without preceding declaration | – | – |
| css/light-dark-needs-scheme | When using `light-dark()`, set `color-scheme: light dark` (usually on `:root`). | MDN states the function needs it; Newly since 2024-05-13. | MDN light-dark(), https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark | CSS | static: `light-dark(` present and no `color-scheme` | – | – |
| css/view-transitions-progressive | Treat view transitions as enhancement: feature-check `document.startViewTransition`, and disable or shorten them under reduced motion; cross-document (`@view-transition`) is Limited. | Same-document is Newly (2025-10-14); cross-document lacks Firefox. | MDN View Transition API, https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API | CSS / JS | static: `startViewTransition` call without existence check | – | – |
| css/anchor-positioning-fallback | Do not rely on anchor positioning for essential UI yet; keep a working fallback position under `@supports`. | Limited in web-features 3.45.0. | MDN CSS anchor positioning, https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning | CSS | static: `anchor-name`/`position-anchor` outside `@supports` | – | `@oddbird/css-anchor-positioning@0.10.2`, BSD-3-Clause (npm), 35.4 kB min+gz (bundlephobia): not light; prefer a CSS fallback |
| css/scroll-animations-progressive | Wrap scroll-driven animations in `@supports (animation-timeline: scroll())` and in `prefers-reduced-motion: no-preference`. | Newly only since 2026-10-27; motion can harm vestibular users. | MDN CSS scroll-driven animations, https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations | CSS | static: `animation-timeline` outside `@supports` | – | – |
| css/text-wrap-headings | Use `text-wrap: balance` on headings and short blocks, and `text-wrap: pretty` on body text only as enhancement. | Balance is Newly (2024-05-13); pretty is Limited; both fail safe. | MDN text-wrap, https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap | CSS | manual | – | – |
| css/field-sizing-progressive | Use `field-sizing: content` for auto-growing inputs/textareas as enhancement, keeping a sensible `min-height`/`rows`. | Newly since 2026-06-16. | MDN field-sizing, https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing | CSS | manual | JS autosize → `field-sizing: content` + fallback | – |

## What to avoid

Severity: `css/focus-outline-removed` error; `css/animate-layout-props`, `css/no-runtime-import`, `css/fixed-height-text`, `css/no-hand-prefixes`, `css/font-size-relative` warning; others info.

| id | rule (own words, one sentence) | why | source (name, URL, section/criterion) | applies to | check | bad → good | light library |
|---|---|---|---|---|---|---|---|
| css/focus-outline-removed | Never remove the focus outline (`outline: none`/`0`) unless the same rule or a `:focus-visible` rule gives an equally visible replacement. | Keyboard users lose their place; documented WCAG failure F78. | WCAG 2.4.7 Focus Visible (AA) https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html; F78 https://www.w3.org/WAI/WCAG22/Techniques/failures/F78; W3Schools Accessibility #4 | CSS | static: `outline: none\|0` in a `:focus` rule (or global) with no `outline`/`box-shadow`/`border` replacement on `:focus`/`:focus-visible` for that selector; runtime check is manual (Tab through) | `button:focus{outline:none}` → `button:focus-visible{outline:2px solid currentColor; outline-offset:2px}` | – |
| css/focus-visible | Style custom focus rings with `:focus-visible` rather than `:focus`. | Shows the ring for keyboard use without flashing it on mouse click; Widely since 2024-09-14 (W3Schools still shows `:focus`). | MDN :focus-visible, https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible | CSS | static: custom outline only on `:focus` | – | – |
| css/focus-ring-forced-colors | If a focus style uses `box-shadow`, also set a transparent outline (for example `outline: 2px solid transparent`). | Forced-colors mode removes `box-shadow` but repaints outline colour, so the ring survives. | MDN forced-colors, https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors | CSS | static: focus rule with `box-shadow` and `outline:none` | – | – |
| css/animate-layout-props | Animate `transform` and `opacity`; avoid animating layout properties such as `width`, `height`, `top`, `left`, `margin`. | Layout and paint work on every frame causes jank. | web.dev Animations guide, https://web.dev/articles/animations-guide; W3Schools Optimization #7 | CSS | static: `transition`/`@keyframes` listing width/height/top/left/right/bottom/margin/padding | `transition: left .3s` → `transition: transform .3s` (`translate`) | – |
| css/will-change-sparingly | Add `will-change` only to fix a measured problem, and remove it after the change when set from JS. | Extra layers cost memory and can slow things down. | web.dev Animations guide; MDN will-change https://developer.mozilla.org/en-US/docs/Web/CSS/will-change | CSS | static: `will-change` on many selectors or on `*` | – | – |
| css/no-runtime-import | Do not chain stylesheets with `@import` in CSS that ships to the browser; use `<link rel="stylesheet">` or let the bundler inline imports. | Imported files are found late, cannot be seen by the preload scanner and download one after another, delaying render. | web.dev Optimize resource loading, https://web.dev/learn/performance/optimize-resource-loading; W3Schools Optimization #4 | CSS | static: `@import` in a `.css` file served as-is (not processed by Sass/PostCSS/bundler) | `@import "a.css"` → `<link rel=stylesheet href=a.css>` | – |
| css/fixed-height-text | Do not give text containers a fixed `height`; use `min-height` or let content size them. | When users raise line or letter spacing (or zoom) text is clipped or overlaps, which fails 1.4.12 (F104). | WCAG 1.4.12 Text Spacing (AA), https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html | CSS | static (heuristic): `height` in px/rem on selectors for buttons, headings, cards, plus `overflow:hidden`; confirm manually with a text-spacing bookmarklet | `.btn{height:40px}` → `.btn{min-height:40px; padding-block:.5em}` | – |
| css/font-size-relative | Set font sizes in `rem`/`em` (or `clamp()` with rem bounds), not fixed `px`, especially on `html`/`body`. | Respects the user's browser font-size setting. | W3Schools Accessibility #2, https://www.w3schools.com/css/css_accessibility.asp; WCAG 1.4.4 https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html | CSS | static: `font-size: <n>px` on `html`/`:root`/`body` (warning), elsewhere (info) | `html{font-size:14px}` → leave default or `font-size:100%` | – |
| css/line-height-unitless | Give `line-height` as a unitless number, about 1.5 for body text. | Unitless values inherit as a ratio; MDN recommends at least 1.5 for main paragraphs. | MDN line-height, https://developer.mozilla.org/en-US/docs/Web/CSS/line-height (Accessibility) | CSS | static: `line-height` with `px`/`em`/`%` on text containers | `line-height:20px` → `line-height:1.5` | – |
| css/no-hand-prefixes | Do not write vendor prefixes by hand; write the standard property and let Autoprefixer add prefixes from the project's browserslist. | Hand prefixes go stale and are often wrong or unneeded. | Autoprefixer README, https://github.com/postcss/autoprefixer; stylelint `property-no-vendor-prefix`, `value-no-vendor-prefix`, `selector-no-vendor-prefix`, `at-rule-no-vendor-prefix`, `media-feature-name-no-vendor-prefix` | CSS | static: stylelint rules above | `-webkit-border-radius` → `border-radius` | autoprefixer@10.6.2, MIT (npm), build-time only, no runtime bytes |
| css/no-transition-all-limit | Keep motion short and purposeful; remove animations that add nothing. | Many large animations cost CPU and battery. | W3Schools Optimization #6 | CSS | manual | – | – |

## User preferences: motion, colour scheme, contrast, forced colours

Severity: `css/reduced-motion` warning; `css/forced-color-adjust-none` warning; others info.

| id | rule (own words, one sentence) | why | source (name, URL, section/criterion) | applies to | check | bad → good | light library |
|---|---|---|---|---|---|---|---|
| css/reduced-motion | Put non-essential motion (parallax, large transitions, auto-moving content) inside `@media (prefers-reduced-motion: no-preference)` or tone it down under `reduce`. | Motion can trigger vestibular symptoms; C39 is a sufficient technique for 2.3.3 (AAA); auto-moving content over 5 s also needs pause/stop under 2.2.2 (A). | WCAG 2.3.3 https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html; C39 https://www.w3.org/WAI/WCAG22/Techniques/css/C39; 2.2.2 https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html; MDN https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion | CSS | static: `@keyframes`/`animation`/`scroll-behavior:smooth`/`animation-timeline` present and no `prefers-reduced-motion` anywhere | – | – |
| css/reduced-motion-reduce-not-break | Prefer reducing motion (shorter, fade instead of slide) to a global `* { animation: none !important }`, and check that scripts waiting for `animationend`/`transitionend` still work. | The blanket reset (W3Schools' example) can leave UI stuck when no end event fires. | W3Schools Accessibility #6 and !important page (show the blanket reset); MDN prefers-reduced-motion | CSS / JS | manual | – | – |
| css/color-scheme-declared | When the site supports dark mode, declare `color-scheme: light dark` on `:root` (and the `<meta name="color-scheme">` if useful) so form controls and scrollbars match. | Otherwise native controls stay light on a dark page. | MDN color-scheme, https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme (Widely 2024-08-03) | CSS | static: `prefers-color-scheme: dark` block present and no `color-scheme` | – | – |
| css/dark-mode-follow-system | Default the theme to `prefers-color-scheme` and, if you add a toggle, let the user's choice override and persist. | Respects the OS setting. | MDN prefers-color-scheme, https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme | CSS / JS | manual | – | – |
| css/forced-colors-test | Test in forced-colors mode and do not convey boundaries, state or focus with `box-shadow` or gradient backgrounds alone. | Those are removed in forced colours; borders and outlines are kept with system colours. | MDN forced-colors (overridden properties) | CSS | runtime: Chrome DevTools rendering emulation "forced-colors: active"; manual review | shadow-only card edge → add `border:1px solid transparent` | – |
| css/forced-color-adjust-none | Use `forced-color-adjust: none` only on small parts that must keep author colours (e.g. colour swatches), never on whole sections. | It removes the user's chosen palette and text backplates. | MDN forced-color-adjust, https://developer.mozilla.org/en-US/docs/Web/CSS/forced-color-adjust | CSS | static: `forced-color-adjust: none` on `html`, `body`, `*`, layout wrappers | – | – |
| css/forced-colors-system-colors | Inside `@media (forced-colors: active)` fixes, use system colour keywords (`CanvasText`, `ButtonText`, `Canvas`, …), not hex values. | Keeps the user's palette. | MDN forced-colors; MDN system colours https://developer.mozilla.org/en-US/docs/Web/CSS/system-color | CSS | static: hex/rgb inside a forced-colors block | `border-color:#000` → `border-color:ButtonText` | – |
| css/prefers-contrast-optional | Optionally strengthen borders and text contrast under `@media (prefers-contrast: more)`. | Widely since 2024-11-30. | MDN prefers-contrast https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast | CSS | manual | – | – |

## W3Schools advice that is dated or needs a caveat

| W3Schools page | what it says (paraphrased) | caveat for skill authors |
|---|---|---|
| Optimization #2 | Avoid the universal selector because it slows rendering. | The cost is negligible today; `*, ::before, ::after { box-sizing: border-box }` is standard. The real issue with `*` is broad side effects (e.g. resetting `font-size`). Do not lint `*`. Not verified with a primary benchmark. |
| Optimization #1 | Complex selectors slow parsing. | Keep the advice, but justify it by specificity and maintainability. |
| Optimization #7 | Prefer animating `transform`, `opacity` and `filter`. | web.dev names only `transform` and `opacity` as compositor-friendly; do not promise that `filter` avoids paint. |
| Optimization #8 | Combine everything into one CSS file. | With HTTP/2+ and code-splitting, "one file" is not always best; the rule is "avoid render-blocking request chains". |
| Accessibility #3 | Use `:focus` for focus styles. | Prefer `:focus-visible` (Widely since 2024-09-14). |
| Accessibility #6 / !important | Turn all animation and transition off with `!important` under reduced motion. | Works but is blunt; see `css/reduced-motion-reduce-not-break`. |
| HTML Style Guide | Indent with two spaces, not tabs. | Fine as default; respect an existing `.editorconfig`/Prettier config instead of fighting it. |

## Notes for skill authors

- **Short skill (always loaded):** `focus-outline-removed`, `animate-layout-props`, `important-sprawl`, `no-id-selectors`, `selector-depth`, `fixed-height-text`, `font-size-relative`, `reduced-motion`, `no-runtime-import`, `no-hand-prefixes`, `limited-needs-fallback`, `nesting-native-syntax`, `container-queries-components`, `gap-over-margins`. These are the ones an agent breaks most when writing CSS.
- **Reference file:** the Baseline table (with its date), layers/`:where()` patterns, naming-convention details, forced-colors and colour details, the W3Schools caveat table.
- **Noisy / controversial:** naming conventions (never report across conventions; only inside the one detected); `!important` (report counts, not each use; utilities and reduced-motion overrides are legitimate); logical properties (only warn when the project shows RTL/i18n); `selector-max-compound-selectors` thresholds; `fixed-height-text` is a heuristic and must say "confirm manually".
- **Changes often, recheck before each release:** every Baseline row (especially `anchor-positioning`, `scroll-driven-animations`, `cross-document-view-transitions`, `text-wrap-pretty`, `accent-color`, `@scope`, `field-sizing`); Stylelint major version (18.0.0 was published 2026-11-03, rule names may move); Tailwind docs URLs.
- **Tool limits:** static checks find suspicious patterns; whether focus is visible, motion is reduced acceptably, or forced-colors output is usable needs a person with a keyboard and the OS setting. Automated checks find only part of the problems.
- Stylelint (`stylelint@18.0.0`, MIT) and `stylelint-config-standard@41.0.0` (MIT) are the natural static engine; all rule names cited above were confirmed in the current rule list. They are dev dependencies, not shipped bytes.

## Not verified

- Licence of the CSS Modules spec repository: no `LICENSE` file found at `master/LICENSE` (404) and the GitHub API returned no licence; irrelevant for rules (it is a spec, not a dependency) but do not state one.
- BEM "alternative naming schemes" page (where the `--` modifier variant is described): the old `en.bem.info/methodology/naming-convention/` URL returned 404; the `--` variant is described in the table only as "widely used", from general knowledge, not from a primary page.
- A primary-source benchmark on universal-selector or selector-matching cost (for the W3Schools caveat) — none read; the caveat is stated as opinion.
- `accent-color` being Limited: taken from web-features data (no `chrome_android` entry); reason not confirmed elsewhere.
- Anchor positioning per-browser partial support (Chrome/Edge shipped parts earlier): the explorer page shows only Safari 27 for the full feature; per-property support was not checked on MDN.
- MDN `system-color` page: URL resolves (HTTP 200) but its content was not read today; the keyword list in `css/forced-colors-system-colors` comes from the forced-colors page plus general knowledge. (The shorthand-reset statement was confirmed on MDN Shorthand properties: omitted sub-values go back to the shorthand's defaults.)
