---
id: state/query-error-state
title: A component that reads a query (TanStack Query, SWR) also reads its error and shows it; it never renders only data.
severity: moderate
check: static
applies:
  - jsx
  - vue
  - svelte
stack:
  - tanstack-query
  - swr
skill: fe-data-fetching
since: 0.1.0
sources:
  - title: TanStack Query docs, Queries (pending, error and success states)
    url: https://tanstack.com/query/latest/docs/framework/react/guides/queries
  - title: SWR docs, Error handling (source in the vercel/swr-site repository)
    url: https://github.com/vercel/swr-site/blob/main/content/docs/error-handling.mdx
---

## Why

`const { data } = useQuery(...)` handles only the happy path. When the request fails, `data` stays `undefined`: the list is silently empty, or `data.map` throws and takes the page down. The person cannot tell "nothing here" from "something broke" and has no way to retry.

## Fix

Read `error` (or `isError`/`status`) with `data`, and render three states: pending (a skeleton or "Loading…", announced with `role="status"` where it matters), error (a message and a retry button calling `refetch()`), and success. For a whole area, `useSuspenseQuery` with a Suspense boundary and an error boundary is the alternative; a global `throwOnError` setup counts too (mark the line with `fs-ignore state/query-error-state`). Make the query function throw on HTTP errors (js/fetch-check-ok), or there is no error to show.

## Examples

```jsx
// bad
const { data } = useQuery({ queryKey: ['todos'], queryFn: getTodos })
return <ul>{data?.map((t) => <li key={t.id}>{t.title}</li>)}</ul>
// good
const { data, error, isPending, refetch } = useQuery({ queryKey: ['todos'], queryFn: getTodos })
if (isPending) return <p role="status">Loading todos…</p>
if (error) return <p role="alert">Could not load todos. <button type="button" onClick={() => refetch()}>Retry</button></p>
return <ul>{data.map((t) => <li key={t.id}>{t.title}</li>)}</ul>
```
