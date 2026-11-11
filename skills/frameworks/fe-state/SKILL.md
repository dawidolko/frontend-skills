---
name: fe-state
description: Decides where front-end state lives and writes stores that stay correct - component state, URL, context, Pinia, Zustand, Redux Toolkit, Svelte runes, Angular signals - with stable selectors and no server data copied into stores. Use when adding or reviewing a store, a selector or shared state, fixing stale or looping UI, or asked where some state should go.
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: State and stores
  area: frameworks
  lane: B
  requires: "react vue svelte angular"
  globs: "**/*.js **/*.jsx **/*.ts **/*.tsx **/*.vue **/*.svelte"
  rules: "state/selector-stable-result state/immer-mutate-or-return state/pinia-store-to-refs state/redux-toolkit state/no-server-state-in-store state/url-state"
  version: 0.1.0
---

# State and stores

Read `.frontend-skills/profile.json` (framework, `data` libraries such as pinia, zustand, redux, tanstack-query) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Put each value in the narrowest home: derived (computed in render), component, URL, shared parent, context, store; a store only for client state many distant parts share.
- Never copy server data into a store; use the framework loader or a query cache (state/no-server-state-in-store).
- Filters, sort, page, tab and search live in the URL (state/url-state).
- Selectors return existing values, never a new object or array per call; use `useShallow` or `shallowEqual` (state/selector-stable-result).
- In Redux Toolkit or Immer reducers, mutate the draft or return a new state, never both (state/immer-mutate-or-return).
- Use `configureStore` and `createSlice`, not `createStore` (state/redux-toolkit).
- Take Pinia state and getters out with `storeToRefs()`; destructure only actions (state/pinia-store-to-refs).
- Update state immutably outside Immer: new arrays and objects, `signal.update()`, never `push` on a value a framework compares by reference.
- Never keep per-user state in module-level variables of server-rendered code; create stores per request (Pinia, `useState` in Nuxt, context in SvelteKit).

## Do this

1. Find the existing store setup first (`stores/`, `store/`, `*.store.*`, `createSlice`, `defineStore`, `create(` from zustand) and follow it; do not add a second library.
2. Before adding state, ask: can it be derived, live in the URL, or stay in one component? Model it as one status value (`'idle' | 'saving' | 'error'`) rather than several booleans.
3. React: `useState` or `useReducer` locally, context for rarely changing values (theme, user), Zustand or Redux Toolkit for frequently changing shared client state; subscribe with narrow selectors.
4. Vue: `ref` and `computed` locally, Pinia setup stores (`defineStore('cart', () => { … })`) for shared state, `storeToRefs` in components.
5. Svelte 5: `$state` and `$derived`; shared state as a `$state` object in a `.svelte.js` module for client-only code, context for anything rendered on the server.
6. Angular: `signal`, `computed` and `linkedSignal` in services, exposed with `asReadonly()`; update with `set` and `update`.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports unstable selectors, Immer arrows that mutate and return, Pinia destructuring and legacy `createStore`.
- Open the store devtools (Redux DevTools, Vue DevTools Pinia tab) and check that every entry is client state and not a copy of an API response.
- Reload a filtered page and press Back: the filters must survive.

## References

- [references/state.md](references/state.md): where state lives, library comparison with versions, store patterns per framework, SSR leaks. Read it when adding a store or choosing a library.
