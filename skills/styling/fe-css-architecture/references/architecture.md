# CSS architecture reference

Depth for the `fe-css-architecture` skill. Rule ids in brackets: `frontend-skills explain <id>`. Checked on 2026-11-11.

## The project's conventions come first

The checks adapt to what the project already has. `init` and `learn` record the project's helpers in `.frontend-skills/profile.json` (`profile.helpers`; a person can correct them with `"source": "person"`):

```json
"helpers": {
  "rem-function": { "kind": "sass-function", "name": "rem-calc", "call": "rem-calc(16px)", "file": "src/styles/_functions.scss" },
  "icon-classes": { "kind": "icon-font", "prefix": "icon-", "sourceDir": "src/icons", "example": "icon-<name>" },
  "custom-properties": { "file": "src/styles/tokens.css", "prefixes": ["--color-*", "--space-*"] }
}
```

| Rule | Runs when | Its fix names |
| --- | --- | --- |
| [css/design-tokens] | always; matches literals against the global tokens the project defines | the token (`var(--color-brand)`, `$color-brand`) |
| [css/no-magic-numbers] | the project has a spacing scale (3 or more `--space-*`, `$spacer-*` tokens) | the nearest step |
| [css/z-index-scale] | always; stricter when a `--z-*`/`$z-*` scale exists | the scale's layers |
| [css/rem-helper] | the profile records `rem-function` | the function (`rem-calc(16px)`) |
| [css/rem-units] | no `rem-function` and no `px-to-rem-build` | the rem value |
| [css/icon-from-set] | the profile records `icon-classes` or `icon-sprite`, or the file uses icon classes or an icons module | the class prefix (`.icon-search`) |
| [css/asset-url] | the project is built by Vite, webpack, Next.js, Nuxt, Angular, Astro or SvelteKit | a relative path or alias |

Hand-made conversions such as `math.div(24px, 16px) * 1rem` are `sass/rem-helper` (see `fe-sass`).

## Tokens

| Tier | Example | Use |
| --- | --- | --- |
| Primitive | `--blue-600: oklch(52% 0.2 260)` | the palette; never used directly in components |
| Semantic | `--color-brand: var(--blue-600)`, `--color-text-muted` | what components use; dark mode swaps these |
| Component | `--button-bg: var(--color-brand)` | only when a component is themed from outside |

- Name by role, not by value: `--color-danger`, not `--red`; `--space-3`, not `--12px`.
- Custom properties work at run time (themes, dark mode, inheritance); Sass variables only at build time. With Sass, keep Sass variables for build-time maths and expose the tokens as custom properties.
- Dark mode: redefine the semantic tokens under `@media (prefers-color-scheme: dark)` or a `[data-theme="dark"]` scope; components do not change.
- Tailwind 4 projects define tokens in CSS with `@theme`; use the generated utilities or `var(--color-…)`.

## Scales

```css
:root {
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem; --space-4: 1rem; --space-6: 1.5rem; --space-8: 2rem;
  --z-dropdown: 1000; --z-sticky: 1050; --z-modal: 1100; --z-toast: 1200;
}
```

- Offsets that look like magic numbers usually mean the layout is fighting the content: use `gap`, flex or grid alignment, `place-self`, or `calc()` from tokens [css/no-magic-numbers].
- `z-index` only works within its stacking context. Before raising a number, check whether a parent with `transform`, `filter`, `opacity < 1` or `isolation: isolate` contains it [css/z-index-scale].

## Units

| Value | Unit | Why |
| --- | --- | --- |
| Font size | `rem` (or the project's helper) | follows the user's text size [css/rem-helper, css/rem-units] |
| Spacing | `rem` or tokens; `em` inside a component that should scale with its own text | consistent rhythm |
| Breakpoints | `em`/`rem` or the helper | follow the text size, not the device |
| Line height | unitless (`1.5` body, `1.1`–`1.3` headings) | inherits as a ratio [css/unitless-line-height] |
| Borders, hairlines, shadows | `px` | should not grow with text |
| Layout widths | `%`, `fr`, `min()`, `ch` for measure | fluid |

Foundation's `rem-calc(16)` returns `1rem` with the default 16px base; a project's own `to-rem()` does the same. In a plain `.css` file a Sass helper cannot run: write the rem value.

## Cascade and specificity

```css
@layer reset, base, components, utilities;   /* first line of the entry stylesheet */
@import url("vendor.css") layer(reset);
@layer base { :where(h1, h2, h3) { line-height: 1.2; } }
@layer components { .card { padding: var(--space-4); } .card--featured { border-color: var(--color-brand); } }
@layer utilities { .sr-only { position: absolute !important; } }
```

- Layer order is decided by the first time each name appears; one statement makes it explicit.
- Normal styles outside any layer beat every layered style. For `!important` the order flips: earlier layers win.
- `:where()` has zero specificity, so resets wrapped in it never fight components; `:is()` takes the weight of its heaviest argument.
- An id outweighs any number of classes [css/no-id-selectors]; `!important` only wins until the next one [css/no-important].

## Naming conventions

| Convention | Pattern | Notes |
| --- | --- | --- |
| BEM | `.block__element--modifier` | one level of element; no `.block__a__b` |
| CSS Modules | `.cardTitle` in `Card.module.css`, used as `styles.cardTitle` | classes are local; camelCase avoids bracket access |
| Utility-first | `class="flex gap-4"` | extract a component for repeated class strings; write complete class names |
| Scoped styles | Vue `<style scoped>`, Svelte, Angular | still one class per element; no ids |

Use the one the project already uses; check two existing components before writing a third.

## Icons

| Set | Markup | CSS |
| --- | --- | --- |
| SVG sprite built from `src/icons/*.svg` | `<svg><use href="#icon-search"/></svg>` or the icon component | size with `width`/`height: 1em`, colour with `fill: currentColor` |
| Icon classes built from the same folder | `<span class="icon-search" aria-hidden="true"></span>` | the generated classes or mixin only [css/icon-from-set] |

Add a new icon to the source folder and rebuild; never reference the SVG file by path. Decorative icons get `aria-hidden="true"`; an icon-only button needs an accessible name.

## Assets per bundler

| Tool | Do | Note |
| --- | --- | --- |
| Vite (and frameworks on it) | `url('../assets/hero.jpg')`, `import hero from './hero.jpg'` | imported and `url()` files get a hashed name; `public/` files are copied as-is, unhashed |
| Next.js | import the image (`import hero from './hero.jpg'`) for `next/image` | `basePath` is not added to a hard-coded `src` |
| SvelteKit | import from the assets folder | imported files are hashed |
| webpack 5 | asset modules (`type: 'asset/resource'`); relative `url()` | resolved and hashed by the build |

Keep `public/` for files that must keep their name and are not referenced from code [css/asset-url].

## Sources

- MDN, Using CSS custom properties: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties
- MDN, Cascade layers: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers
- MDN, Specificity: https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity
- MDN, Stacking context: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context
- MDN, line-height: https://developer.mozilla.org/en-US/docs/Web/CSS/line-height
- Foundation for Sites, rem-calc: https://get.foundation/sites/docs/sass-functions.html#rem-calc
- Sass, Variables: https://sass-lang.com/documentation/variables/
- W3C Design Tokens Community Group, format: https://www.designtokens.org/tr/drafts/format/
- Vite, Static Asset Handling: https://vite.dev/guide/assets
- Next.js, basePath: https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath
- SvelteKit, Images: https://svelte.dev/docs/kit/images
- webpack, Asset Management: https://webpack.js.org/guides/asset-management/
- Autoprefixer: https://github.com/postcss/autoprefixer
- Research notes: `docs/sources/css.md` (2026-11-11)
