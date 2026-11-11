# SvelteKit reference

Depth for the `fe-sveltekit` skill, for SvelteKit 3 (latest stable checked 2026-11-11 on the npm registry: `@sveltejs/kit` 3.2.0; 3.0 was released on 2026-10-01, and Kit 2 is still on the `version-2` tag). Rule ids in brackets: `frontend-skills explain <id>`.

## Route files

| File | Runs on | Holds |
| --- | --- | --- |
| `+page.svelte` | server and browser | the page; its own `<svelte:head><title>` [svelte/kit-page-title] |
| `+page.js` | server and browser | `load` for public data, page options (`prerender`, `ssr`, `csr`) |
| `+page.server.js` | server only | `load` with secrets or the database, `actions` for forms [svelte/kit-form-actions] |
| `+layout.svelte`, `+layout.js`, `+layout.server.js` | as above | shared UI and data for a subtree |
| `+server.js` | server only | API endpoints (`GET`, `POST` ... returning `Response`) |
| `+error.svelte` | server and browser | the error page of a subtree |
| `src/hooks.server.js` | server only | `handle` (auth into `event.locals`, `lang`), `handleError` |
| `src/app.html` | template | `<html lang>`, `%sveltekit.head%`, `%sveltekit.body%` |

No module-level variables hold request data in any server file [svelte/kit-shared-server-state].

## Load

- Use the `fetch` argument: it carries cookies, works during server rendering and is inlined into the page so the browser does not repeat it.
- Independent data: start every request, then `await` them together; call `await parent()` after them [svelte/kit-load-waterfall].
- Slow, optional data: return the promise un-awaited and render it with `{#await}`.
- Rerun control: `depends('app:cart')` with `invalidate('app:cart')`; `invalidateAll()` after a change that affects everything.
- Pure: return data; never write to module state or a shared store.

## Form actions

```js
// +page.server.js
import { fail, redirect } from '@sveltejs/kit'
export const actions = {
  create: async ({ request, locals }) => {
    const data = await request.formData()
    const title = String(data.get('title') ?? '').trim()
    if (!title) return fail(400, { values: { title }, errors: { title: 'Enter a title.' } })
    await locals.db.posts.create({ title, author: locals.user.id })
    redirect(303, '/posts')
  }
}
```

The page reads `form` from `$props()`, keeps typed values, shows errors next to their fields, and adds `use:enhance` from `$app/forms`. In Kit 3 an enhanced response keeps the status passed to `fail()`.

## Page options

| Option | Default | Set it when |
| --- | --- | --- |
| `prerender = true` | `false` | every visitor gets the same HTML; not with form actions or `url.searchParams` in `load` |
| `ssr = false` | `true` | the page cannot render on a server (a browser-only tool); never for content pages, since it costs SEO and adds a request waterfall |
| `csr = false` | `true` | the page needs no JavaScript at all (an article) |
| `trailingSlash` | `'never'` | the host or old URLs need it |

## Kit 2 to Kit 3

| Kit 2 | Kit 3 |
| --- | --- |
| `svelte.config.js` with `kit: { ... }` | `sveltekit({ ... })` options in `vite.config.js`; `svelte.config.js` is no longer read |
| `$lib` alias | `#lib` in the `imports` field of `package.json`, imports with file extensions |
| `$app/stores` (`$page`) | `$app/state` (`page`) [svelte/kit-app-state]; `npx sv migrate app-state` |
| `$app/environment` | `$app/env` |
| `$env/static/private` and the other `$env/*` modules | `$app/env/private`, `$app/env/public` (`$env/*` deprecated) |
| `base`, `assets`, `resolveRoute` from `$app/paths` | `resolve()` and `asset()`; `asset('logo.png')` without a leading slash |
| `csrf.checkOrigin` | removed; CSRF protection is always on, allow hosts with `csrf.trustedOrigins` |
| `error(404, { message })` | `error(404, 'Not found', { extra })`: the message is a string |
| `instanceof` checks on errors | `isHttpError()`, `isRedirect()` |
| `json()`, `text()` helpers | `Response.json()`, `new Response()` (helpers deprecated) |

Minimums for Kit 3: Node 22.17, TypeScript 6, Svelte 5.57.1, Vite 8.0.12, `@sveltejs/vite-plugin-svelte` 7. Upgrade with `npx sv migrate sveltekit-3`.

## Security

- Secrets: only in server files and `src/lib/server/`; the build refuses to import them into client code.
- `{@html}` only with sanitised content (see `fe-security`).
- Configure `csp` in the Kit options so Kit adds nonces or hashes to its own inline scripts.
- Authentication in `handle`: read the session cookie, put the user on `event.locals`, never in a module variable.

## Performance and accessibility

- Images: `@sveltejs/enhanced-img` (`<enhanced:img src="./hero.jpg" alt="...">`) or an image CDN; files in `static/` are served as they are.
- Fonts: Kit does not preload them; preload the critical one and subset it.
- Split rarely used components with `import()`; measure with `vite build && vite preview`, not in dev.
- After client navigation Kit announces the new `<title>` and moves focus to `<body>` (or to an `autofocus` element); customise with `afterNavigate`.

## Sources

- Project structure: https://svelte.dev/docs/kit/project-structure
- Loading data: https://svelte.dev/docs/kit/load
- Form actions: https://svelte.dev/docs/kit/form-actions
- Page options: https://svelte.dev/docs/kit/page-options
- State management: https://svelte.dev/docs/kit/state-management
- Server-only modules: https://svelte.dev/docs/kit/server-only-modules
- Accessibility: https://svelte.dev/docs/kit/accessibility
- Performance: https://svelte.dev/docs/kit/performance
- Images: https://svelte.dev/docs/kit/images
- Migrating to SvelteKit v3: https://svelte.dev/docs/kit/migrating-to-sveltekit-3
- $app/state: https://svelte.dev/docs/kit/$app-state
- sv migrate: https://svelte.dev/docs/cli/sv-migrate
- npm registry, @sveltejs/kit: https://registry.npmjs.org/@sveltejs/kit/latest
