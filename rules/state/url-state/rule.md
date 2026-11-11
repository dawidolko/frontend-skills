---
id: state/url-state
title: State a person would share, bookmark or restore with Back (filters, sort, page, selected tab, search) lives in the URL.
severity: minor
check: manual
applies:
  - jsx
  - vue
  - svelte
  - angular
skill: fe-state
since: 0.1.0
sources:
  - title: SvelteKit docs, State management (storing state in the URL)
    url: https://svelte.dev/docs/kit/state-management
  - title: Next.js docs, useSearchParams
    url: https://nextjs.org/docs/app/api-reference/functions/use-search-params
---

## Why

Filters and pagination kept in component or store state are lost on reload, cannot be shared as a link, and the Back button leaves the page instead of undoing the last filter. Server rendering also cannot see them, so the first paint shows the unfiltered list.

## Fix

Read these values from the search params (`useSearchParams`, `page.url.searchParams`, `useRoute().query`, `ActivatedRoute.queryParamMap`) and change them by navigating (`router.replace` for typing, `push` for deliberate steps). Keep throwaway UI state (an open menu, hover) in component state.

## Examples

```jsx
// bad
const [sort, setSort] = useState('price')
// good
const params = useSearchParams()
const sort = params.get('sort') ?? 'price'
```
