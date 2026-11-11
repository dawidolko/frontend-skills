# React: sources and candidate rules

Read on 2026-11-11. Primary sources:

- npm registry, `react`: https://www.npmjs.com/package/react (JSON: https://registry.npmjs.org/react)
- npm registry, `react-dom`: https://www.npmjs.com/package/react-dom
- npm registry, `eslint-plugin-react-hooks`: https://www.npmjs.com/package/eslint-plugin-react-hooks (README read from the 7.1.1 tarball)
- React blog: https://react.dev/blog and the 19.3 post https://react.dev/blog/2026/09/09/react-19-3
- React docs (react.dev): Rules of React https://react.dev/reference/rules, You Might Not Need an Effect https://react.dev/learn/you-might-not-need-an-effect, Rendering Lists https://react.dev/learn/rendering-lists, Choosing the State Structure https://react.dev/learn/choosing-the-state-structure, `memo` https://react.dev/reference/react/memo, `lazy` https://react.dev/reference/react/lazy, `useId` https://react.dev/reference/react/useId, common DOM props https://react.dev/reference/react-dom/components/common, `hydrateRoot` https://react.dev/reference/react-dom/client/hydrateRoot, `'use server'` https://react.dev/reference/rsc/use-server, Server Functions https://react.dev/reference/rsc/server-functions, React Compiler https://react.dev/learn/react-compiler/introduction, ESLint plugin https://react.dev/reference/eslint-plugin-react-hooks, Creating a React App https://react.dev/learn/creating-a-react-app

## Version (verified 2026-11-11)

| package | latest stable | published (registry `time`) | licence (registry) | notes |
|---|---|---|---|---|
| `react` | **19.3.1** | 2026-10-14 | MIT | 19.3.0 published 2026-09-09; blog post "React 19.3" dated September 9, 2026. Canary tag `19.3.0-canary-…-20261109` exists; ignore canary/next tags. |
| `react-dom` | **19.3.1** | 2026-10-14 | MIT | must match `react` |
| `eslint-plugin-react-hooks` | **7.1.1** | 2026-04-17 | MIT | 7.0.0 published 2025-10-08; has `recommended` and `recommended-latest` flat configs |
| `babel-plugin-react-compiler` | **1.0.0** | 2025-10-07 | MIT | "React Compiler v1.0" blog post, October 7, 2025 |
| `@vitejs/plugin-react` | 6.3.0 | – | MIT | detection signal only |

What 19.3 adds (blog, 2026-09-09): stable `<ViewTransition>` and `addTransitionType`, stable Fragment refs (`<Fragment ref>` → `FragmentInstance`), `browser()` from `react-dom` (use with `use()` to skip SSR for a component), Trusted Types pass-through for `dangerouslySetInnerHTML` and other sinks, Server Components can render `<Context>` from a `'use client'` module directly, Strict Mode double-invokes Effects during hydration. No deprecations in the post.

Security history worth a rule writer's note: React blog posts of 2025-12-03 ("Critical Security Vulnerability in React Server Components", fixed in 19.0.1 / 19.1.2 / 19.2.1) and 2025-12-11 (two more RSC issues). An audit should flag an RSC project pinned below a patched release; recheck the advisory list each time.

## Stack detection

| signal | meaning | confidence |
|---|---|---|
| `react` and `react-dom` in `dependencies` (package.json) | React DOM app | high |
| `react` without `react-dom`, with `react-native` / `expo` | React Native; out of scope for web rules | high |
| `next` in deps / `next.config.{js,mjs,ts}` | Next.js (see `nextjs.md`), React rules still apply | high |
| `@vitejs/plugin-react` in devDeps and `vite.config.{js,ts,mjs,mts}` | Vite + React SPA | high |
| `*.jsx` / `*.tsx` files; `import … from 'react'`; `createRoot(` / `hydrateRoot(` from `react-dom/client` | React code present | medium (TSX can be other JSX libs; check import source) |
| `'use client'` / `'use server'` directives at file top | React Server Components setup (a framework: Next.js, React Router, etc.) | high |
| `babel-plugin-react-compiler` in devDeps, or `reactCompiler: true` in `next.config.*` | React Compiler on: relax manual-memo advice | high |
| `eslint-plugin-react-hooks` in devDeps | static check is available; read its config | high |

The docs list as recommended frameworks: Next.js (App Router), React Router (v7), Expo; others: TanStack Start (beta), RedwoodSDK; from scratch: Vite, Parcel, Rsbuild (https://react.dev/learn/creating-a-react-app). Create React App is sunset (blog, 2025-02-14): `react-scripts` in deps is a signal to recommend migration.

## Static check: eslint-plugin-react-hooks 7.1.1

Flat config: `reactHooks.configs.flat.recommended`; `reactHooks.configs.flat['recommended-latest']` for the newest compiler rules; legacy: `plugin:react-hooks/recommended` (README, 7.1.1 tarball). The docs say the lints cover the two classic rules plus "issues flagged by React Compiler", and the compiler need not be installed for the lint to run (https://react.dev/reference/eslint-plugin-react-hooks).

| rule | README default severity | kind |
|---|---|---|
| `react-hooks/rules-of-hooks` | error | classic |
| `react-hooks/exhaustive-deps` | warn | classic |
| `react-hooks/component-hook-factories` | (listed in docs) | compiler-powered |
| `react-hooks/config`, `react-hooks/gating` | error | compiler config |
| `react-hooks/error-boundaries` | error | compiler-powered |
| `react-hooks/globals` | error | compiler-powered |
| `react-hooks/immutability` | error | compiler-powered |
| `react-hooks/incompatible-library` | warn | compiler-powered |
| `react-hooks/preserve-manual-memoization` | error | compiler-powered |
| `react-hooks/purity` | error | compiler-powered |
| `react-hooks/refs` | error | compiler-powered |
| `react-hooks/set-state-in-effect` | error | compiler-powered |
| `react-hooks/set-state-in-render` | error | compiler-powered |
| `react-hooks/static-components` | error | compiler-powered |
| `react-hooks/unsupported-syntax` | warn | compiler-powered |
| `react-hooks/use-memo` | error | compiler-powered |

"kind" is my grouping from the docs sentence above; the docs page does not tag each rule individually.

## Components and purity

Severity: error unless stated.

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `react/pure-render` | Render code must give the same output for the same props, state and context, with no side effects (no fetch, no DOM writes, no globals) during render. | React may render many times, out of order, or discard renders; impure render gives wrong UI. | Rules of React, https://react.dev/reference/rules/components-and-hooks-must-be-pure | React | static: `react-hooks/purity`, `react-hooks/globals` | `Date.now()`/`fetch()` in body → in event handler or Effect | – | error |
| `react/no-mutate-props-state` | Never mutate props, state, hook arguments/returns, or values already passed to JSX; create a new value instead. | Mutation skips re-render and breaks memoization. | https://react.dev/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable | React | static: `react-hooks/immutability` | `props.items.push(x)` → `[...items, x]` | – | error |
| `react/no-call-component-as-function` | Render components with JSX, never call the component function directly. | Direct calls bypass React's hook and state bookkeeping. | https://react.dev/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly | React | static: call `Foo(` where `Foo` is a component (PascalCase returning JSX) | `{Card(props)}` → `<Card {...props} />` | – | error |
| `react/no-nested-component-definition` | Define components at module top level, not inside another component's body. | A nested definition is a new type every render, so its state resets and DOM is rebuilt. | `react-hooks/static-components` and `component-hook-factories`, https://react.dev/reference/eslint-plugin-react-hooks | React | static: `react-hooks/static-components` | `function List(){ function Row(){} }` → move `Row` out | – | error |
| `react/no-ref-read-in-render` | Do not read or write `ref.current` during render; only in handlers and Effects. | Refs are not tracked; reading them in render shows stale values. | https://react.dev/reference/eslint-plugin-react-hooks (`refs`) | React | static: `react-hooks/refs` | `{ref.current.width}` in JSX → state set from Effect | – | error |
| `react/no-set-state-in-render` | Do not call a state setter unconditionally while rendering. | Causes infinite re-render loops. | https://react.dev/reference/eslint-plugin-react-hooks (`set-state-in-render`) | React | static: `react-hooks/set-state-in-render` | `setX(1)` in body → derive value or set in handler | – | error |
| `react/error-boundary-not-try-catch` | Catch child render errors with an Error Boundary, not try/catch around JSX. | try/catch cannot catch errors thrown while children render. | https://react.dev/reference/eslint-plugin-react-hooks (`error-boundaries`) | React | static: `react-hooks/error-boundaries` | `try { return <Child/> }` → `<ErrorBoundary>` | – | error |

## Hooks and state

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `react/hooks-top-level` | Call Hooks only at the top level of a component or custom Hook, never in loops, conditions, nested functions or after an early return. | React matches Hook state by call order. | https://react.dev/reference/rules/rules-of-hooks | React | static: `react-hooks/rules-of-hooks` | `if (x) useState()` → call always, branch on value | – | error |
| `react/hooks-from-react-functions` | Call Hooks only from components or custom Hooks (named `use…`), not from plain functions or class components. | Hooks need a component render context. | https://react.dev/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions | React | static: `react-hooks/rules-of-hooks` | `function helper(){ useEffect() }` → `useHelper` | – | error |
| `react/no-hooks-as-values` | Do not pass Hooks around as values or create them dynamically. | Breaks static analysis and the order guarantee. | https://react.dev/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values | React | static: Hook identifier passed as an argument or prop | `withHook(useX)` → call `useX()` inside | – | error |
| `react/exhaustive-deps` | List every reactive value an Effect/useMemo/useCallback reads in its dependency array; fix the code, not the array. | Missing deps cause stale values and bugs. | https://react.dev/reference/eslint-plugin-react-hooks | React | static: `react-hooks/exhaustive-deps` | `// eslint-disable-next-line` → move object inside the Effect | – | warning |
| `react/no-redundant-state` | Do not keep state that can be computed from props or other state; compute it during render. | Duplicated state drifts out of sync. | https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state | React | manual (pattern: `useState` + Effect that only copies/derives) | `fullName` state → `const fullName = a + ' ' + b` | – | warning |
| `react/state-structure` | Group state that always changes together, avoid contradictory flags, avoid duplicated and deeply nested state. | Fewer impossible states, simpler updates. | https://react.dev/learn/choosing-the-state-structure | React | manual | `isSending`+`isSent` → `status: 'typing'|'sending'|'sent'` | – | info |
| `react/keep-state-local` | Keep state as close as possible to where it is used; lift it only as far as needed. | Unneeded lifting re-renders large trees. | https://react.dev/reference/react/memo#should-you-add-memo-everywhere | React | manual | input state in page root → in the form component | – | info |
| `react/useid-for-aria` | Use `useId` to generate ids linking labels/descriptions (`htmlFor`, `aria-describedby`), never a counter or `Math.random`, and never for list keys. | Stable across server and client, unique per instance. | https://react.dev/reference/react/useId | React | static: `id={Math.random()…}` or `id={`x-${n++}`}` | `aria-describedby="hint"` (hard-coded, repeated) → `useId()` | – | warning |

## Effects ("You Might Not Need an Effect")

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `react/no-derived-state-effect` | Compute values from props/state during render instead of copying them into state from an Effect. | Extra render pass and stale frame. | https://react.dev/learn/you-might-not-need-an-effect#updating-state-based-on-props-or-state | React | static: `react-hooks/set-state-in-effect` (sync setState in Effect) | `useEffect(()=>setFull(a+b),[a,b])` → `const full=a+b` | – | warning |
| `react/event-logic-in-handlers` | Put logic caused by a user action (POST, notification, navigation) in the event handler, not in an Effect watching state. | Effects run because a component displayed, not because of the click. | https://react.dev/learn/you-might-not-need-an-effect#sharing-logic-between-event-handlers | React | manual | Effect on `jsonToSubmit` → `fetch` in `onSubmit` | – | warning |
| `react/reset-state-with-key` | Reset a subtree's state on identity change by giving it a `key`, not with an Effect. | Simpler and no flash of stale state. | https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes | React | manual | `useEffect(()=>setComment(''),[userId])` → `<Profile key={userId}/>` | – | info |
| `react/no-effect-chains` | Do not chain Effects that set state to trigger other Effects; compute next state together in the handler. | Many re-renders and fragile ordering. | https://react.dev/learn/you-might-not-need-an-effect#chains-of-computations | React | manual (several Effects each only calling setters) | effect chain → one handler | – | warning |
| `react/notify-parent-in-handler` | Call a parent's `onChange` in the same handler that updates state, or lift state up, rather than from an Effect. | Avoids a second render pass and ordering bugs. | https://react.dev/learn/you-might-not-need-an-effect#notifying-parent-components-about-state-changes | React | manual | Effect calling `onChange(isOn)` → call in handler | – | info |
| `react/external-store-sync` | Subscribe to external mutable sources with `useSyncExternalStore`, not a hand-written Effect + state. | Correct under concurrent rendering and SSR. | https://react.dev/learn/you-might-not-need-an-effect#subscribing-to-an-external-store | React | static (heuristic): `addEventListener` + `setState` in Effect for `online`/`storage` | Effect for `navigator.onLine` → `useSyncExternalStore` | – | info |
| `react/fetch-effect-cleanup` | If you fetch in an Effect, ignore stale responses in the cleanup; prefer the framework's data fetching or a data library. | Without cleanup, out-of-order responses show wrong data. | https://react.dev/learn/you-might-not-need-an-effect#fetching-data | React | static (heuristic): `fetch(` in `useEffect` with no returned cleanup | no cleanup → `let ignore=false; return ()=>{ignore=true}` | – | warning |
| `react/app-init-once` | Run one-time app setup at module level or behind a module flag, not in a mount Effect. | Strict Mode runs Effects twice in development. | https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application | React | manual | `useEffect(()=>checkAuth(),[])` in root → guarded module call | – | info |

## Lists and keys

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `react/list-key` | Every element returned from `map()` needs a `key` that is unique among siblings. | React matches items to DOM/state by key. | https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key | React | static: JSX in `.map(` callback without `key` (eslint-plugin-react `jsx-key`) | `<li>` → `<li key={item.id}>` | – | error |
| `react/stable-key` | Use a stable id from the data as key; avoid the array index when items can be reordered, inserted or removed, and never generate keys during render. | Index or random keys lose input state and rebuild DOM. | https://react.dev/learn/rendering-lists#rules-of-keys | React | static: `key={index}` / `key={i}` (warning), `key={Math.random()}` / `crypto.randomUUID()` in render (error) | `key={i}` → `key={todo.id}` | – | warning (index) / error (random) |
| `react/fragment-key` | When a list item renders several nodes, use `<Fragment key>` because `<>` cannot take a key. | Short fragments can't carry keys. | https://react.dev/learn/rendering-lists#displaying-several-dom-nodes-for-each-list-item | React | static: `<>` as `.map` return root | `<>…</>` → `<Fragment key={id}>` | – | error |

## Rendering modes: SSR, hydration, Server Components

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `react/hydration-same-output` | The first client render must match the server HTML: no `typeof window` branches, browser-only APIs or changing data (time, random) in render. | Mismatches cost performance and may bind handlers to wrong nodes. | https://react.dev/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html | React SSR | static: `typeof window` / `window.`/`localStorage` / `new Date()` inside component body | branch in render → `use(browser())` (19.3) or two-pass render | – | error |
| `react/suppress-hydration-sparingly` | Use `suppressHydrationWarning` only for one unavoidable value such as a timestamp; it works one level deep and React will not patch text. | It hides real bugs when overused. | https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors | React SSR | static: count of `suppressHydrationWarning` on non-leaf elements | on `<body>` wrapper → on the `<time>` only | – | warning |
| `react/client-only-with-browser` | For a component that must render only in the browser, call `use(browser())` (react-dom 19.3+) rather than an `isClient` Effect. | Skips SSR cleanly with a Suspense fallback; no double render. | React 19.3 blog, https://react.dev/blog/2026/09/09/react-19-3; hydrateRoot page | React ≥19.3 SSR | static: `useState(false)`+`useEffect(()=>setIsClient(true))` | isClient pattern → `use(browser())` | – | info |
| `react/server-function-untrusted-input` | Treat every Server Function argument as untrusted: validate it and check the user is allowed to do the action inside the function. | Server Functions are callable by any client with crafted input. | https://react.dev/reference/rsc/use-server#security | React RSC | static: `'use server'` export with no schema parse / auth call (heuristic) + manual | raw `formData.get` to DB → parse + authorize | zod (not size-checked here; see Not verified) | error |
| `react/server-function-serializable` | Pass only serializable values to and from Server Functions (no functions, class instances, JSX). | They cross the network. | https://react.dev/reference/rsc/use-server#serializable-parameters-and-return-values | React RSC | runtime/build error | pass class instance → plain object | – | error |
| `react/rsc-patched-version` | Projects using React Server Components must run a React version that includes the December 2025 RSC security fixes (19.0.1 / 19.1.2 / 19.2.1 or later per the advisories). | Known critical vulnerability in the RSC protocol. | https://react.dev/blog (posts 2025-12-03 and 2025-12-11) | React RSC | static: version in lockfile vs advisory list | `19.2.0` → latest 19.3.x | – | error |

## Accessibility (what React's docs say)

react.dev has **no dedicated accessibility guide** (the llms.txt index lists none; the old reactjs.org page is legacy). React-specific a11y guidance is spread over DOM prop docs. General a11y rules belong in the `a11y` area; keep only the React-specific bits here.

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `react/label-htmlfor` | Associate `<label>` with its control via `htmlFor` (React's name for `for`) or by nesting. | Unlabelled inputs are unusable with screen readers. | https://react.dev/reference/react-dom/components/common#common-props (`htmlFor`) | React | static: `<label for=` (wrong prop) or label with no `htmlFor`/child input | `for="x"` → `htmlFor={id}` | eslint-plugin-jsx-a11y@6.10.2, MIT (registry) | error |
| `react/tabindex-0-or-minus-1` | Use only `tabIndex` 0 or -1. | Positive values break natural focus order. | https://react.dev/reference/react-dom/components/common#common-props (`tabIndex`) | React | static: `tabIndex={n}` with n > 0 | `tabIndex={3}` → DOM order + `0` | eslint-plugin-jsx-a11y (`tabindex-no-positive`) | warning |
| `react/aria-names-as-html` | Write ARIA attributes exactly as in HTML (`aria-*` lowercase-hyphen), not camelCase. | camelCase ARIA props are not ARIA. | https://react.dev/reference/react-dom/components/common#common-props (`aria-*`) | React | static: `ariaLabel=` / `ariaHidden=` | `ariaLabel` → `aria-label` | eslint-plugin-jsx-a11y (`aria-props`) | error |
| `react/focus-group-fragment-ref` | To move focus into a group of siblings without a wrapper, use a Fragment ref's `focus()` / `focusLast()` (19.3). | Manages focus (dialogs, lists) without extra DOM. | https://react.dev/blog/2026/09/09/react-19-3 | React ≥19.3 | manual | wrapper `<div tabIndex=-1>` → `<Fragment ref>` | – | info |

## Performance

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `react/compiler-over-manual-memo` | With React Compiler on, write new code without `useMemo`/`useCallback`/`memo` except as an explicit escape hatch; leave existing memoization unless tests cover its removal. | The compiler memoizes components and hooks; removing old memo can change output. | https://react.dev/learn/react-compiler/introduction; https://react.dev/reference/react/memo#react-compiler-memo | React + Compiler | static: compiler enabled + new `useMemo` (info only) | – | `babel-plugin-react-compiler@1.0.0`, MIT (registry) | info |
| `react/memo-only-when-measured` | Without the compiler, add `memo`/`useMemo` only where profiling shows slow re-renders with unchanged props; prefer passing `children`, local state and fewer Effects first. | Memo everywhere hurts readability and breaks on one new-object prop. | https://react.dev/reference/react/memo#should-you-add-memo-everywhere | React | manual (React DevTools Profiler) | blanket `memo()` → restructure | – | info |
| `react/memo-stable-props` | When a child is memoized, do not pass it objects/functions created fresh every render. | `Object.is` comparison fails every time. | https://react.dev/reference/react/memo#minimizing-props-changes | React | static (heuristic): inline `{}`/`()=>` prop on a `memo` component | `style={{…}}` → hoisted constant | – | warning |
| `react/lazy-at-module-level` | Declare `lazy()` components at module top level and wrap them in `<Suspense>`. | `lazy` inside a component resets state every render. | https://react.dev/reference/react/lazy#my-lazy-components-state-gets-reset-unexpectedly | React | static: `lazy(` call inside a function body | inside `Editor()` → module scope | – | error |
| `react/compiler-incompatible-library` | Heed `incompatible-library` / `unsupported-syntax` warnings: code there is skipped by the compiler. | Silent loss of optimization. | https://react.dev/reference/eslint-plugin-react-hooks | React + Compiler | static: those two rules | – | – | info |

## Security

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `react/no-unsanitized-dangerous-html` | Use `dangerouslySetInnerHTML` only with trusted, sanitized HTML (or a `TrustedHTML` from your policy), and build the `{__html}` object next to where the HTML is produced, not inline in JSX. | Untrusted HTML here is a direct XSS hole. | https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html | React | static: `dangerouslySetInnerHTML={{__html: <non-literal>}}` without a sanitize call in scope | user markdown → sanitized string / TrustedHTML | DOMPurify (size not verified here; see Not verified) | error |
| `react/trusted-types-ready` | On sites enforcing Trusted Types, pass `TrustedHTML`/`TrustedScriptURL` objects to sinks; React 19.3+ no longer stringifies them. | Under CSP `require-trusted-types-for 'script'` string values are blocked. | https://react.dev/blog/2026/09/09/react-19-3 | React ≥19.3 | runtime (CSP report) | string → policy-created object | – | info |
| `react/no-secrets-in-client` | Never import secrets or server-only modules into client code; in RSC setups use the experimental taint APIs only as a backup. | Anything in a client bundle is public. | https://react.dev/reference/rsc/use-server#security | React RSC | static: env secret names in `'use client'` files | – | – | error |

## Notes for skill authors

- Short skill: Rules of React (purity, hooks order), keys, "derive don't sync" from You Might Not Need an Effect, `dangerouslySetInnerHTML`, Server Function input/auth. Point to `eslint-plugin-react-hooks` `recommended` as the static check; most rules above map to a lint rule, so the skill should run the linter rather than re-implement it.
- Reference file: the full Effect alternatives table, hydration list, compiler notes, memo principles.
- Noisy: `stable-key` with index (static lists are fine; the docs say avoid only when order can change), heuristics for fetch-in-Effect and redundant state. Keep them warning/info.
- Controversial: manual memo. With the compiler, adding `useMemo` is noise; without it, blanket `memo` is a team choice the docs call "no significant harm". Don't flag as error.
- Changes often: React minor versions (19.3 in Sept 2026), RSC security advisories, the compiler rule set in `recommended` vs `recommended-latest`. Recheck npm and https://react.dev/blog each release.
- What only a person can check: whether HTML is really trusted, whether state structure is sensible, whether Effects synchronize with an external system.
- Accessibility: React gives few a11y rules of its own; rely on the general `a11y` area plus eslint-plugin-jsx-a11y for JSX. Automated checks find only part of the problems.

## AI-agent resources

- `https://react.dev/llms.txt` exists (index of Learn + API reference pages; each page has a `.md` twin, e.g. https://react.dev/learn/rendering-lists.md).
- No official React MCP server or agent rule file found on react.dev.

## Not verified

- Per-rule "compiler-powered" tag for `eslint-plugin-react-hooks`: the docs page does not label rules individually; grouping above is from the docs' summary sentence and the README comment "React Compiler rules".
- Exact list of rules in `recommended` vs `recommended-latest` (7.1.1): README names both presets but I did not diff the two config objects.
- Min+gzip sizes for DOMPurify, zod, eslint-plugin-jsx-a11y: not fetched from bundlephobia/pkg-size; fill in before recommending.
- React Router v7 config file name (`react-router.config.ts`) for detection: not confirmed on a primary source in this pass.
- Whether react.dev's `memo` page "React Compiler" section applies equally to `useCallback` (the intro page speaks only of `useMemo`/`useCallback` for existing code).
- `jsx-key` rule (eslint-plugin-react) name: from memory; Next.js docs confirm eslint-plugin-react's recommended set is used but I did not open its rule list.
