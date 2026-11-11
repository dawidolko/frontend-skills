---
id: js/asset-import
title: In a bundled project, images, fonts and media in component markup are imported or use the base-path helper, not hard-coded root paths.
severity: moderate
check: static
applies:
  - jsx
  - vue
  - svelte
  - astro
stack:
  - vite
  - next
  - nuxt
  - sveltekit
  - astro
  - webpack
skill: fe-javascript
since: 0.1.0
sources:
  - title: Vite, Building for production (public base path and import.meta.env.BASE_URL)
    url: https://vite.dev/guide/build#public-base-path
  - title: Vite, Static asset handling (importing an asset as a URL)
    url: https://vite.dev/guide/assets
  - title: Next.js, basePath (images need the base path)
    url: https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath
  - title: Astro, Images (import local images)
    url: https://docs.astro.build/en/guides/images/
---

## Why

A string such as `src="/images/hero.jpg"` in a component skips the bundler: the file gets no content hash (so caches serve the old image after a change), is not optimised, is not checked at build time (a renamed file fails only in production), and breaks when the site is served under a base path (`/app/`), because only imports, CSS `url()` and `index.html` are rewritten.

## Fix

Import the file from the source tree (`import hero from './hero.jpg'`) and use the result, or the framework's image component with that import (`next/image`, Astro `<Image>`, `@nuxt/image`, SvelteKit `enhanced:img`). For files that must stay in `public/`, build the URL with the base helper: `import.meta.env.BASE_URL` (Vite, Astro), `asset()` from `$app/paths` (SvelteKit), `useRuntimeConfig().app.baseURL` (Nuxt), the configured `basePath` (Next.js). Vue templates may use relative or `@/` paths, which the compiler turns into imports. Icons follow `html/icon-from-set`.

## Examples

```jsx
// bad
<img src="/images/hero.jpg" alt="Harbour at dawn" width="1200" height="600" />
// good
import hero from './assets/hero.jpg'
<img src={hero} alt="Harbour at dawn" width="1200" height="600" />
```
