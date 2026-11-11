# Icons reference

Depth for the `fe-icons` skill. Packages and licences from the npm registry, checked 2026-11-11. Rule ids in brackets: `frontend-skills explain <id>`.

## The three shapes of a generated set

| Shape | What the build makes | Markup | Good for |
| --- | --- | --- | --- |
| SVG sprite | One SVG of `<symbol id="icon-close">` elements, injected into the page or served with a hash | `<svg aria-hidden="true"><use href="#icon-close"></use></svg>` | Any stack; one request, `currentColor`, cached |
| Component per icon | One component per SVG (compiled at build time) | `<IconClose />`, `import IconClose from '~icons/app/close'` | Frameworks; only the icons used are bundled |
| Icon classes | A CSS file with one class per icon (mask image or font glyph) | `<i class="icon icon-close" aria-hidden="true"></i>` | Plain sites and CMS templates |

In each case the source of truth is one folder of SVG files (for example `src/icons/`); adding `src/icons/cart.svg` and rebuilding makes `cart` available everywhere [html/icon-from-set]. A hand-placed `public/icons/cart.svg` linked by path skips the set.

## Generators

| Package (version, licence) | Shape | Setup in short |
| --- | --- | --- |
| `vite-plugin-svg-icons` 2.0.1, MIT | Sprite | `createSvgIconsPlugin({ iconDirs: [path.resolve('src/icons')], symbolId: 'icon-[dir]-[name]' })`, `import 'virtual:svg-icons-register'` in the entry |
| `unplugin-icons` 24.0.0, MIT | Component | `Icons({ customCollections: { app: FileSystemIconLoader('./src/icons') } })`, then `import IconClose from '~icons/app/close'`; Iconify sets via `@iconify/json` 2.2.555, MIT |
| `vite-plugin-svgr` 5.2.0, MIT / `@svgr/webpack` 8.1.0, MIT | Component (React) | `import Close from './icons/close.svg?react'` |
| `astro-icon` 1.2.0, MIT | Component (Astro) | SVGs in `src/icons/`, `import { Icon } from 'astro-icon/components'`, `<Icon name="close" />` |
| `@angular/material` 22.2.7, MIT | Registry (Angular) | `MatIconRegistry.addSvgIconSet(...)` or `addSvgIcon(...)` with `DomSanitizer`, then `<mat-icon svgIcon="close">` |
| `svg-sprite` 2.0.4, MIT / `svgstore` 3.0.1, MIT | Sprite | Node build step for stacks without a bundler plugin |
| `fantasticon` 4.1.0, MIT | Icon font and classes | Font plus CSS from a folder; prefer a sprite or mask classes for new work |
| `@iconify/tailwind4` 1.2.3, MIT | Classes (Tailwind) | Icon classes generated from Iconify sets and custom folders |

## One Icon component per framework (sprite)

```tsx
// React: src/components/Icon.tsx
type Props = { name: string; label?: string; className?: string }
export function Icon({ name, label, className }: Props) {
  return (
    <svg className={className ?? 'icon'} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <use href={`#icon-${name}`} />
    </svg>
  )
}
```

```vue
<!-- Vue: src/components/SvgIcon.vue -->
<script setup lang="ts">
const props = defineProps<{ name: string; label?: string }>()
</script>
<template>
  <svg class="icon" :role="props.label ? 'img' : undefined" :aria-label="props.label" :aria-hidden="props.label ? undefined : 'true'">
    <use :href="`#icon-${props.name}`" />
  </svg>
</template>
```

```svelte
<!-- Svelte: src/lib/Icon.svelte -->
<script lang="ts">
  let { name, label }: { name: string; label?: string } = $props()
</script>
<svg class="icon" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : 'true'}><use href={`#icon-${name}`} /></svg>
```

```css
.icon { inline-size: 1em; block-size: 1em; fill: currentColor; flex-shrink: 0; vertical-align: -0.125em; }
```

Angular: register once (`iconRegistry.addSvgIconSet(sanitizer.bypassSecurityTrustResourceUrl('icons/sprite.svg'))`, where the URL comes from the build output) and use `<mat-icon svgIcon="close" aria-hidden="true">`. Lit: render `svg\`<use href="#icon-${name}"></use>\`` inside a light-DOM sprite, or include the sprite in the shadow root, since `<use href="#id">` does not reach across the shadow boundary.

## Accessibility

| Case | Markup |
| --- | --- |
| Icon beside visible text | Icon `aria-hidden="true"`; the text names the control |
| Icon-only button or link | `<button type="button" aria-label="Close">` with the icon `aria-hidden="true"` (or visually hidden text inside) |
| Icon that carries meaning alone (status) | `role="img"` and `aria-label` on the `<svg>`, or `<img alt="Error">` [a11y/img-alt] |
| Icon fonts | The glyph must be `aria-hidden="true"`; a font that fails to load shows boxes, and a private-use glyph can be announced as an odd character: prefer SVG |
| Colour | `currentColor` keeps contrast with the text and follows dark mode and forced colours |
| Size | `1em` follows the font size and zoom; targets at least 24 by 24 CSS px (WCAG 2.5.8) |

## Moving from hard-coded files to a set

1. List the icon files referenced by path: `npx github:dawidolko/frontend-skills audit` and look for `html/icon-from-set` (markup) and `css/icon-from-set` (CSS).
2. Move each SVG into the source folder, strip fixed `fill`, `stroke` colours (use `currentColor`) and `width`/`height`, keep `viewBox`.
3. Replace each reference with the component, class or `<use>`, adding `aria-hidden` or a label as above.
4. Delete the old files from `public/` once nothing links them.

## Sources

- MDN, the use element: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/use
- MDN, the symbol element: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/symbol
- MDN, aria-hidden: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-hidden
- WAI-ARIA APG, Providing accessible names and descriptions: https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/
- WCAG 2.2, Understanding SC 2.5.8 Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- vite-plugin-svg-icons: https://github.com/vbenjs/vite-plugin-svg-icons
- unplugin-icons: https://github.com/unplugin/unplugin-icons
- SVGR: https://react-svgr.com/docs/what-is-svgr/
- astro-icon: https://www.astroicon.dev/getting-started/
- Angular Material icon: https://material.angular.dev/components/icon/overview
- Vite static assets: https://vite.dev/guide/assets
