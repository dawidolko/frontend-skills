---
name: fe-perf-delivery
description: Ships less and earlier - JavaScript and CSS delivery, code splitting, hydration cost, third-party scripts and facades, resource hints, caching headers and modern browser targets - in any stack. Use when a bundle is large, a page loads many scripts, adding analytics, a widget or a dependency, setting cache headers, or when asked "why is this page heavy" or "reduce JavaScript".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer; the page audit needs a local Chrome.
metadata:
  title: JavaScript, CSS and asset delivery
  area: performance
  lane: C
  requires: web
  globs: "**/*.html **/*.jsx **/*.tsx **/*.js **/*.vue **/*.svelte **/*.astro **/*.css"
  rules: "perf/render-blocking-script perf/third-party-async perf/css-no-import perf/no-whole-library-import perf/code-split perf/third-party-cost perf/cache-static-assets perf/no-legacy-javascript"
  version: 0.1.0
---

# JavaScript, CSS and asset delivery

Read `.frontend-skills/profile.json` (framework, build tool) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Head scripts use `defer` or `type="module"`; third-party scripts use `async`, `defer` or a framework strategy (perf/render-blocking-script, perf/third-party-async).
- Shipped CSS never chains files with `@import`; link them or bundle them (perf/css-no-import).
- Never import all of `lodash` or `moment` in client code; use `lodash-es`, per-method paths or `Intl` (perf/no-whole-library-import).
- Split by route and load rare features with `import()` (perf/code-split).
- Each third party has an owner and a reason, loads late, and heavy embeds start as a facade (perf/third-party-cost).
- Hashed assets are cached a year as `immutable`; HTML is `no-cache` (perf/cache-static-assets).
- Declare browser targets once; no blanket polyfills for Baseline features (perf/no-legacy-javascript).
- Hydrate only what is interactive: server-render static parts, use islands or server components.
- Preconnect to at most two or three critical origins; preload only late-discovered critical files.
- Before adding a dependency, check its size and whether the platform already does it.

## Do this

1. Measure first: the build's bundle report (`rollup-plugin-visualizer`, `@next/bundle-analyzer`, Lighthouse treemap) and the network panel on a throttled mobile profile.
2. Remove before you optimise: unused dependencies, duplicate libraries, dead routes, polyfills for old browsers.
3. Move work off the critical path: `defer` scripts, lazy routes and dialogs, `client:visible` or `@defer` for below-the-fold widgets.
4. Shrink what stays: tree-shakable imports, modern targets, Brotli compression on the host, small critical CSS.
5. Set caching once in the host configuration, and verify the response headers of a deployed page.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` finds blocking head and third-party scripts, CSS `@import` chains in plain sites and whole-library imports.
- `audit --url <page>` maps Lighthouse's unused JavaScript, third parties, cache lifetimes and legacy JavaScript results to these rule ids.
- By hand: compare the bundle report before and after a change; a new dependency over ~20 kB gzip needs a reason in the pull request.

## References

- [references/delivery.md](references/delivery.md): loading strategies table, framework splitting and hydration options, resource hints, speculation rules, cache header recipes, budgets with size-limit. Read it when reducing bundle size or adding a third party.
