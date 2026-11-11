---
id: state/fetch-effect-cleanup
title: An effect that fetches into state returns a cleanup that ignores or aborts stale responses.
severity: moderate
check: static
applies:
  - jsx
stack:
  - react
  - next
  - preact
skill: fe-data-fetching
since: 0.1.0
sources:
  - title: React docs, You Might Not Need an Effect (fetching data)
    url: https://react.dev/learn/you-might-not-need-an-effect
  - title: React docs, Synchronizing with Effects (fetching data)
    url: https://react.dev/learn/synchronizing-with-effects
---

## Why

When the input changes quickly (typing in a search box, clicking through pages), several requests are in flight and their answers arrive in any order. Without a cleanup, the last answer to arrive wins, so the page can show results for "hel" under the query "hello". A response that lands after the component unmounted also writes into a dead component.

## Fix

Return a cleanup: `let ignore = false … if (!ignore) setResults(json) … return () => { ignore = true }`, or pass an `AbortController` signal to `fetch` and call `abort()` in the cleanup. Better still, load page data with the framework (Server Components, route loaders) or a server-state library (TanStack Query, SWR), which handle races, caching and deduplication.

## Examples

```jsx
// bad
useEffect(() => {
  fetch(`/api/search?q=${query}`).then((r) => r.json()).then(setResults)
}, [query])
// good
useEffect(() => {
  const controller = new AbortController()
  getJson(`/api/search?q=${query}`, { signal: controller.signal }).then(setResults, onError)
  return () => controller.abort()
}, [query])
```
