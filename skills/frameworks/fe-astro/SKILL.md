---
name: fe-astro
description: Writes and reviews Astro 7 sites - islands and client directives, server islands, processed scripts, astro:assets images, content collections and environment variables - so pages ship little JavaScript and stay safe. Use when editing .astro files or astro.config, adding a React, Vue or Svelte island, upgrading from Astro 6, or asked to review Astro code.
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Astro sites and islands
  area: frameworks
  lane: B
  requires: astro
  globs: "**/*.astro astro.config.* src/content.config.* src/pages/** src/layouts/** src/components/**"
  rules: "astro/static-by-default astro/client-only-framework astro/directive-on-framework-component astro/server-defer-fallback astro/script-processed astro/public-env-secret js/asset-import"
  version: 0.1.0
---

# Astro sites and islands

Read `.frontend-skills/profile.json` (Astro version, adapter, island frameworks) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill. Islands also follow their framework's skill.

## Rules

- Framework components render without a directive unless they need interactivity; then use the latest directive that works (astro/static-by-default).
- `client:only` names its framework and has a `slot="fallback"` (astro/client-only-framework).
- `client:*` goes only on framework components imported into the `.astro` file, never on Astro components (astro/directive-on-framework-component).
- A `server:defer` island has `slot="fallback"` content and gets small serializable props (astro/server-defer-fallback).
- `<script>` tags carry no attribute but `src` so Astro bundles them; `is:inline` only on purpose; data via `data-*`, not `define:vars` (astro/script-processed).
- Secrets never get the `PUBLIC_` prefix; declare them in `astro:env` as server secrets (astro/public-env-secret).
- Local images live in `src/` and render with `<Image>` or `<Picture>`; never hard-code `/images/...` paths (js/asset-import).
- `set:html` only with trusted or sanitized HTML; it is not escaped.
- Every page has a unique `<title>`; close every tag and keep valid nesting (Astro 7 errors or no longer repairs it).

## Do this

1. Read `astro.config.*`: integrations (`@astrojs/react`, `vue`, `svelte`), the adapter (needed for `server:defer` and `prerender = false`), `site`, `base`, `image`, `env.schema`.
2. Keep pages prerendered; opt one route out with `export const prerender = false`, and personalise parts with server islands instead of making the whole page dynamic.
3. Use content collections (`src/content.config.ts` with a loader and a schema) for Markdown and data, and `getCollection()` to read them.
4. Pass the above-the-fold image `priority` on `<Image>`; give `public/` images explicit `width` and `height`.
5. Style with scoped `<style>` in the component; use `is:global` or `:global()` only where needed, and `class:list` for conditional classes.
6. For small behaviour without a framework, define a custom element in a processed `<script>`; it runs once per page and works for every instance.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports `client:only` without a framework, directives on Astro components, server islands without fallback, unprocessed scripts, public secrets and hard-coded asset paths.
- `astro check` (with `@astrojs/check`) type-checks `.astro` files; `astro build` fails on unclosed tags in Astro 7.
- Use the dev toolbar's Audit app as a first pass, then a browser audit (`audit --url`).

## References

- [references/astro.md](references/astro.md): directive choice, server islands, scripts, images, environment variables, security options and the Astro 7 upgrade notes. Read it when adding an island, a dynamic route or upgrading.
