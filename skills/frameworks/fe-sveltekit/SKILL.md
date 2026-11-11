---
name: fe-sveltekit
description: Builds and reviews SvelteKit 3 apps (and Kit 2 projects on the way up) - routes, load functions, form actions with progressive enhancement, page titles, server-only state and rendering options - so pages work before JavaScript, load without waterfalls and never leak data between users. Use when editing src/routes, a load or action, hooks, or SvelteKit config.
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: SvelteKit apps
  area: frameworks
  lane: B
  requires: sveltekit
  globs: "src/routes/**/* src/hooks*.* src/app.html src/lib/**/* vite.config.* svelte.config.*"
  rules: "svelte/kit-shared-server-state svelte/kit-form-actions svelte/kit-page-title svelte/kit-app-state svelte/kit-load-waterfall js/asset-import js/fetch-check-ok"
  version: 0.1.0
---

# SvelteKit apps

Read `.frontend-skills/profile.json` (Kit version 2 or 3, adapter, TypeScript) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill. Components follow `fe-svelte`.

## Rules

- Never keep per-request data in module-level variables of server code; use `event.locals`, the return of `load`, a database or a cookie (svelte/kit-shared-server-state).
- Forms post to form actions (`method="POST" action="?/name"`) and add `use:enhance`; never a form that works only through `onsubmit` (svelte/kit-form-actions).
- Every page sets its own `<title>` in `<svelte:head>`, or the layout renders one from page data (svelte/kit-page-title).
- Read `page`, `navigating`, `updated` from `$app/state`, never `$app/stores` (svelte/kit-app-state).
- Start independent requests together; `await parent()` after them; stream slow data as promises (svelte/kit-load-waterfall).
- Use the `fetch` passed to `load`, and check `res.ok` (js/fetch-check-ok).
- Secrets only in server code (`+page.server`, `hooks.server`, `src/lib/server`) through the private env module.
- Assets through imports or `asset()` from `$app/paths`; links through `resolve()` when the app has a base path (js/asset-import).
- `load` is pure: no writes to shared stores or globals.
- Keep `ssr` on; `prerender = true` only where every visitor gets the same page.

## Do this

1. Check the Kit version first. Kit 3: config in `vite.config.js` (`sveltekit({ ... })`), `#lib` from `package.json` `imports`, `$app/env/private` and `$app/env/public`, no `base`/`assets` (use `resolve`, `asset`). Kit 2: `svelte.config.js`, `$lib`, `$env/...`. Upgrade with `npx sv migrate sveltekit-3`.
2. Data that needs the database or secrets goes in `+page.server.js` `load`; public API data in `+page.js` `load` with the provided `fetch`.
3. Actions validate input on the server, return `fail(400, { values, errors })`, and the page shows the errors next to their fields (see `fe-a11y-forms`).
4. Filters, sorting and tabs that should survive a reload live in the URL (`method="GET"` forms, `url.searchParams` in `load`).
5. Throw `error(404, 'Not found')` and `redirect(303, '/login')` from `@sveltejs/kit`; in Kit 3 the message is a string and an external redirect needs the `external` option.
6. Set `lang` in `src/app.html` (per page through the `handle` hook for several languages), and keep Kit's focus reset after navigation.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports shared server state, JavaScript-only forms, pages without a title and `$app/stores` imports. The audit reads `.ts` route files only through these project checks.
- `npx sv check --fail-on-warnings` for types and compiler warnings; `vite build` fails on server-only imports in client code.
- Test with JavaScript disabled: forms and links must still work.

## References

- [references/sveltekit.md](references/sveltekit.md): route files, load and actions, page options, Kit 2 to Kit 3 changes, security and performance notes. Read it for a new route, a form, a migration or a rendering decision.
