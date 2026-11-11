# State reference

Depth for the `fe-state` skill. Latest stable versions on the npm registry, checked 2026-11-11: pinia 4.1.0, zustand 5.1.0, @reduxjs/toolkit 2.14.0, jotai 3.0.2; React 19.3, Vue 3.5, Svelte 5.57, Angular 22.2. Rule ids in brackets: `frontend-skills explain <id>`.

## Where a value lives

| The value is | Put it in |
| --- | --- |
| Computable from props, state or data | Nothing: compute it in render, `computed`, `$derived`, `computed()` (react/no-derived-state-effect) |
| Used by one component | Component state (`useState`, `ref`, `$state`, `signal`) |
| Worth sharing as a link or restoring with Back | The URL search params [state/url-state] |
| Needed by siblings | The nearest common parent, passed down |
| Read in many places, changes rarely (theme, locale, signed-in user) | Context / provide-inject / a service |
| Shared client state that changes often (editor, cart drawer, filters across pages) | A store |
| Data that belongs to the server | The framework loader or a query cache, see `fe-data-fetching` [state/no-server-state-in-store] |
| A form being edited | The form (native inputs, a form library); copy into a store only on submit |

## Libraries

| Library | Use | Watch for |
| --- | --- | --- |
| Pinia 4 | Vue's official store; setup stores with `ref`/`computed`/functions | `storeToRefs` for state and getters [state/pinia-store-to-refs]; Vuex is in maintenance |
| Zustand 5 | Small React stores, hook per store | Selectors compare with `Object.is`; new objects loop, wrap with `useShallow` [state/selector-stable-result] |
| Redux Toolkit 2 | Large React apps, devtools and middleware | `configureStore` + `createSlice` [state/redux-toolkit]; Immer rules [state/immer-mutate-or-return]; RTK Query for server data |
| Jotai | Atom-per-value React state | Keep derived atoms pure; do not store server data in atoms either |
| Svelte runes | `$state`, `$derived`, `$effect` | A `$state` object in a shared module is global on the server; use context for per-request data |
| Angular signals | `signal`, `computed`, `linkedSignal`, `effect` as last resort | Expose `asReadonly()`; never mutate the value in place |

## Store patterns

```js
// Zustand: one value per selector, or useShallow for several
const count = useCounterStore((s) => s.count)
const [count, inc] = useCounterStore(useShallow((s) => [s.count, s.inc]))

// Redux Toolkit: mutate in a block body or return a new value
todoAdded: (state, action) => { state.push(action.payload) },
todosCleared: () => [],

// Pinia setup store, used with storeToRefs
export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const total = computed(() => items.value.reduce((sum, i) => sum + i.price, 0))
  function add(item) { items.value.push(item) }
  return { items, total, add }
})
const cart = useCartStore()
const { items, total } = storeToRefs(cart)
```

```ts
// Angular: private writable signal, public read-only view
@Injectable({ providedIn: 'root' })
export class CartService {
  readonly #items = signal<Item[]>([])
  readonly items = this.#items.asReadonly()
  readonly total = computed(() => this.#items().reduce((sum, i) => sum + i.price, 0))
  add(item: Item) { this.#items.update((list) => [...list, item]) }
}
```

## Server rendering

- A module-level store, `ref`, `reactive` or `$state` lives as long as the server process: one request's user data is visible to the next. Create stores per request (Pinia does this when installed per app; Nuxt `useState('key')`; SvelteKit context set in the root layout).
- Do not write to stores inside SvelteKit `load` or Next.js Server Components; return data and let the page read it.
- Only JSON-serialisable values survive the trip from server to client (no class instances, functions or `Map` unless the framework serialises them).

## Review checklist

- Two pieces of state that must change together, or a boolean pair that allows an impossible combination.
- A store field that is an API response, with `loading`/`error` fields beside it.
- `useEffect`, `watch` or `effect()` that only copies one state into another.
- Component state for filters or pagination that a person would expect in the URL.
- A context value that changes on every keystroke, re-rendering every consumer.

## Not checked automatically

Store files written in `.ts` (the audit reads `.js`, `.jsx`, `.tsx`, `.vue`, `.svelte` and `.astro` files), whether a value is really client or server state, and SSR leaks through module state: review those by hand.

## Sources

- React, Choosing the State Structure: https://react.dev/learn/choosing-the-state-structure
- React, Sharing State Between Components: https://react.dev/learn/sharing-state-between-components
- Vue, State Management: https://vuejs.org/guide/scaling-up/state-management
- Vue, SSR cross-request state pollution: https://vuejs.org/guide/scaling-up/ssr#cross-request-state-pollution
- Pinia, Defining a Store: https://pinia.vuejs.org/core-concepts/
- Zustand, Migrating to v5: https://zustand.docs.pmnd.rs/reference/migrations/migrating-to-v5
- Zustand, useShallow: https://zustand.docs.pmnd.rs/reference/hooks/use-shallow
- Redux, Why Redux Toolkit is How To Use Redux Today: https://redux.js.org/introduction/why-rtk-is-redux-today
- Redux Toolkit, Writing Reducers with Immer: https://redux.js.org/toolkit/usage/immer-reducers
- React Redux, Hooks: https://redux.js.org/react-redux/api/hooks
- Svelte, $state: https://svelte.dev/docs/svelte/$state
- SvelteKit, State management: https://svelte.dev/docs/kit/state-management
- Angular, Signals: https://angular.dev/guide/signals
- Angular, linkedSignal: https://angular.dev/guide/signals/linked-signal
- TanStack Query, Does this replace client state?: https://tanstack.com/query/latest/docs/framework/react/guides/does-this-replace-client-state
