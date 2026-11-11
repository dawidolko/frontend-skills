---
id: css/asset-url
title: In a bundled project, url() to images and fonts is a relative path or alias the bundler resolves, not a hard-coded root or public/ path.
severity: minor
check: static
applies:
  - css
  - scss
  - less
  - html
  - vue
  - svelte
  - astro
stack:
  - vite
  - webpack
  - next
  - nuxt
  - angular
  - astro
  - sveltekit
skill: fe-css-architecture
since: 0.1.0
sources:
  - title: Vite, Static Asset Handling (importing assets, url() in CSS, the public directory)
    url: https://vite.dev/guide/assets
  - title: Vite, Building for Production (public base path)
    url: https://vite.dev/guide/build#public-base-path
  - title: Next.js, basePath
    url: https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath
  - title: webpack, Asset Modules
    url: https://webpack.js.org/guides/asset-management/
---

## Why

A relative `url()` makes the file part of the build: the bundler checks that it exists, gives it a content hash (so a changed image is never served stale from cache) and writes the final URL, including the base path when the site lives under a sub-path. A root path such as `/images/hero.jpg` points at a public file instead: it is copied as-is without a hash, and in a framework that does not rewrite it (Next.js `basePath`, for example) it breaks when the base path changes.

## Fix

Keep images and fonts next to the source (`src/assets/…`) and reference them relatively (`url('../assets/hero.jpg')`) or through the project's alias (`@/assets/…`, `~/assets/…`). Keep `public/` for files that must keep their exact name and are not referenced from code (`robots.txt`, `favicon.ico`). In component code, import the file or use the framework's helper (see `js/asset-import`).

## Examples

```css
/* bad */
.hero { background-image: url('/images/hero.jpg'); }
/* good */
.hero { background-image: url('../assets/images/hero.jpg'); }
```
