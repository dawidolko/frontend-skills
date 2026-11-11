---
name: fe-data-fetching
description: Loads and changes server data in front-end apps - framework loaders, TanStack Query, SWR, Nuxt useFetch, Angular httpResource - with correct cache keys, one stable client, loading and error states, race-free effects and invalidation after mutations. Use when fetching data in a component, adding a query or mutation, or fixing stale, duplicated or flickering data.
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Data fetching
  area: frameworks
  lane: B
  requires: "react vue svelte angular next nuxt"
  globs: "**/*.js **/*.jsx **/*.ts **/*.tsx **/*.vue **/*.svelte"
  rules: "state/server-state-cache state/query-key-deps state/query-object-syntax state/query-client-stable state/query-error-state state/fetch-effect-cleanup state/invalidate-after-mutation js/fetch-check-ok"
  version: 0.1.0
---

# Data fetching

Read `.frontend-skills/profile.json` (framework, `data` libraries) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Read server data through the framework loader or a server-state library, not per-component fetch plus loading flags (state/server-state-cache).
- A query key holds every variable its function reads (state/query-key-deps).
- TanStack Query 5 takes one options object: `useQuery({ queryKey, queryFn })` (state/query-object-syntax).
- Create the `QueryClient` once, never in a component body (state/query-client-stable).
- Render pending, error (with retry) and success states; never data only (state/query-error-state).
- Query functions throw on HTTP errors: check `res.ok` (js/fetch-check-ok).
- An effect that fetches into state ignores or aborts stale responses in its cleanup (state/fetch-effect-cleanup).
- After a mutation, invalidate or update every query it changed (state/invalidate-after-mutation).
- Start independent requests together (`Promise.all`, parallel queries), never one after another.
- Pass the `signal` the library gives you to `fetch` so cancelled queries stop.

## Do this

1. Use the stack's own loader first: Server Components or route loaders (Next.js, React Router), `load` (SvelteKit), `useFetch`/`useAsyncData` (Nuxt), `httpResource` or resolvers (Angular). Add TanStack Query or SWR for client-side server state.
2. Define each query once with `queryOptions({ queryKey, queryFn })` or a key factory (`todoKeys.detail(id)`) and reuse it in components, prefetching and invalidation.
3. Set `staleTime` deliberately (the default 0 refetches on every mount and window focus); use `gcTime` for how long unused data stays.
4. Write mutations with `useMutation({ mutationFn, onSuccess })`; invalidate by key prefix, or `setQueryData` from the response; optimistic updates roll back in `onError`.
5. Announce loading with `role="status"` and errors with `role="alert"` where the change is not otherwise visible; keep layout stable with skeletons of the final size.
6. Use plain `fetch` (or `$fetch` in Nuxt) only in event handlers and outside components, through one helper that checks `ok`.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports missing key variables, v4 query syntax, per-render clients, queries without an error state and effects that fetch without a cleanup.
- Enable `@tanstack/query/exhaustive-deps` in ESLint where TanStack Query is used.
- In the Network panel, navigate between two items quickly: each view must show its own data, with no duplicate requests for the same key.

## References

- [references/data-fetching.md](references/data-fetching.md): loaders per framework, TanStack Query and SWR setup, keys, caching options, mutations, SSR hydration. Read it when adding the first query to a project or a mutation.
