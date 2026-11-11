# JavaScript reference

Depth for the `fe-javascript` skill. Language level: ECMAScript 2025 (the edition published in June 2025); Baseline notes from MDN, checked 2026-11-11. Rule ids in brackets: `frontend-skills explain <id>`.

## Async and errors

| Situation | Do this |
| --- | --- |
| Call that may fail | `await` it inside `try`/`catch`, or return the promise to a caller that does [js/no-floating-promises] |
| Independent requests | `await Promise.all([a(), b()])`; `Promise.allSettled` when one failure must not cancel the rest |
| Requests in order | `for (const x of list) await step(x)`; never `list.forEach(async ...)` |
| Fire and forget | `void track(event)` with its own error handling inside |
| Rethrow with context | `throw new Error('Saving the order failed', { cause: err })` [js/throw-error-objects] |
| Ignore on purpose | an empty `catch` with a comment that says why [js/no-empty-catch] |
| Last resort | one `window` listener for `unhandledrejection` and `error` that reports, never the main handling |

A fetch helper that every call goes through [js/fetch-check-ok]:

```js
export async function getJson(url, { signal, timeout = 8000, ...init } = {}) {
  const signals = [AbortSignal.timeout(timeout), signal].filter(Boolean)
  const res = await fetch(url, { ...init, signal: AbortSignal.any(signals) })
  if (!res.ok) throw new Error(`${init.method || 'GET'} ${url} failed: ${res.status}`, { cause: res })
  return res.status === 204 ? null : res.json()
}
```

`AbortSignal.timeout()` rejects with a `TimeoutError`, `abort()` with an `AbortError`: treat an `AbortError` from navigation as normal, not as a failure to show. Both `AbortSignal.timeout` and `AbortSignal.any` are Baseline (2024).

## Events and the DOM

| Pattern | Code |
| --- | --- |
| Delegation | `list.addEventListener('click', (e) => { const row = e.target.closest('[data-id]'); if (row) open(row.dataset.id) })` |
| Cleanup | `const ac = new AbortController(); el.addEventListener('x', f, { signal: ac.signal }); … ac.abort()` [js/listener-cleanup] |
| Scroll and touch | `{ passive: true }` on `touchstart`, `touchmove`, `wheel` [js/passive-listeners]; `window`, `document` and `body` are passive already |
| Text | `el.textContent = name`, never `innerHTML` with data |
| New elements | `document.createElement`, `append`, `replaceChildren`, or clone a `<template>` |
| Layout | read every size first, then write; schedule visual writes with `requestAnimationFrame` |
| Visibility | `IntersectionObserver` instead of `scroll` handlers that call `getBoundingClientRect` |
| Inline handlers | none: `addEventListener` from a module [js/no-inline-handlers] |

## Loading

- `<script type="module" src="/src/main.js">`: deferred, strict, own scope. `defer` has no extra effect on a module; `async` runs it as soon as it loads.
- Classic scripts: `defer` in `<head>` (keeps order), `async` only for independent scripts such as analytics.
- `import()` loads a feature on demand; bundlers turn it into a separate chunk.
- Without a bundler, an import map (`<script type="importmap">`) must come before the first module that uses it.

## Assets through the bundler [js/asset-import]

| Stack | Image or font in a component |
| --- | --- |
| Vite (React, Vue, Svelte, Lit) | `import url from './hero.jpg'`; for `public/`, `` `${import.meta.env.BASE_URL}hero.jpg` `` |
| Next.js | `import hero from './hero.jpg'` with `next/image`; `public/` paths need the `basePath` |
| Nuxt | `~/assets/...` in templates, or `@nuxt/image`; `public/` through `useRuntimeConfig().app.baseURL` |
| SvelteKit | `import url from '$lib/hero.jpg'` or `enhanced:img`; `static/` paths through `asset()` from `$app/paths` |
| Astro | `import hero from '../assets/hero.jpg'` with `<Image>`; `public/` with `import.meta.env.BASE_URL` |
| Angular | `NgOptimizedImage` with paths from the `public` folder set in `angular.json` |

## W3Schools conventions

The W3Schools JavaScript style guide and best practices, with what still holds. A formatter (Prettier, Biome) and the project's config win over the style rows.

| W3Schools says | Today |
| --- | --- |
| camelCase names, PascalCase for classes | Holds; UPPER_SNAKE only for real constants such as `MAX_RETRIES` |
| `===` instead of `==` | Holds [js/strict-equality] |
| Avoid global variables | Holds; modules make it the default |
| Declare variables at the top | Dated: with `let` and `const`, declare where first used, initialised |
| Avoid `new String()`, `new Number()`, `new Object()` | Holds; use literals |
| Use default parameters, end `switch` with `default` | Holds; in TypeScript prefer an exhaustive `never` check |
| Never use `eval()` | Holds [js/no-eval] |
| Scripts at the end of `<body>`, or injected on `onload` | Dated: `defer` or `type="module"` in `<head>` |
| No trailing comma after the last property | Valid JavaScript since ES5; let the formatter decide (still invalid in JSON) |
| Cache `arr.length` in loops, "DOM access is slow" | Dated in detail; the idea (do less work in loops, keep the DOM small) holds |
| Two-space indent, spaces around operators, lines under 80 | Style; the formatter owns it |

## Common mistakes worth a review comment

- `if (x = 10)`: an assignment in a condition.
- `return` followed by a line break: the function returns `undefined`.
- `"5" + 2 === "52"`: convert form and URL values with `Number()` or use `valueAsNumber`.
- Money in floating point: `0.1 + 0.2 !== 0.3`; use integer cents or `Intl.NumberFormat` for display only.
- Named keys on an array: use an object or a `Map`.
- `obj && obj.a && obj.a.b`: use `obj?.a?.b` and `value ?? fallback`.

## Sources

- MDN JavaScript guide: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
- MDN Modules: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- MDN fetch: https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch
- MDN AbortSignal.timeout: https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static
- MDN AbortSignal.any: https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/any_static
- MDN Error cause: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause
- MDN addEventListener: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
- MDN Event bubbling and delegation: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling
- web.dev, Avoid layout thrashing: https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing
- Vite, public base path: https://vite.dev/guide/build#public-base-path
- W3Schools JavaScript Style Guide: https://www.w3schools.com/js/js_conventions.asp
- W3Schools JavaScript Best Practices: https://www.w3schools.com/js/js_best_practices.asp
- ECMAScript 2025 language specification: https://tc39.es/ecma262/2025/
