---
id: state/query-key-deps
title: A TanStack Query key holds every variable its query function reads, so a new id fetches new data instead of showing the old.
severity: serious
check: static
applies:
  - jsx
  - vue
  - svelte
stack:
  - tanstack-query
skill: fe-data-fetching
since: 0.1.0
sources:
  - title: TanStack Query docs, Query Keys (if your query function depends on a variable, include it in your query key)
    url: https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
  - title: TanStack Query docs, ESLint rule exhaustive-deps
    url: https://tanstack.com/query/latest/docs/eslint/exhaustive-deps
---

## Why

The key is the cache address and the only thing TanStack Query watches. With `queryKey: ['todo']` and `queryFn: () => getTodo(id)`, every todo shares one cache entry: open todo 2 after todo 1 and the page shows todo 1's data, and changing `id` never refetches.

## Fix

Put every value the query function uses into the key, in order from general to specific: `queryKey: ['todo', id]`, `['todos', { status, page }]`. In Vue pass the ref or getter itself (`['todo', id]`), not `id.value`. Build keys and functions together with `queryOptions()` or a key factory so they cannot drift apart, and enable `@tanstack/query/exhaustive-deps` in ESLint.

## Examples

```jsx
// bad
useQuery({ queryKey: ['todo'], queryFn: () => getTodo(todoId) })
// good
useQuery({ queryKey: ['todo', todoId], queryFn: () => getTodo(todoId) })
```
