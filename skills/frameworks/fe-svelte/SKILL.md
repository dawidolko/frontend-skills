---
name: fe-svelte
description: Writes and reviews Svelte 5 components in runes mode - $state, $derived, $effect, $props, snippets, event attributes, keyed each blocks - and moves Svelte 4 syntax forward, so components stay reactive, correct and accessible. Use when creating or editing a .svelte or .svelte.js file, fixing a value that does not update, or asked to review Svelte code.
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Svelte components
  area: frameworks
  lane: B
  requires: svelte
  globs: "**/*.svelte **/*.svelte.js **/*.svelte.ts"
  rules: "svelte/no-legacy-syntax svelte/derived-not-effect svelte/props-derived svelte/each-key svelte/window-events a11y/no-click-on-static a11y/img-alt js/listener-cleanup"
  version: 0.1.0
---

# Svelte components

Read `.frontend-skills/profile.json` (Svelte version, SvelteKit or not) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Write runes mode: `$props`, `$state`, `$derived`, `onclick`, snippets; no `export let`, `$:`, `on:click` or `<slot>` (svelte/no-legacy-syntax).
- Compute values with `$derived`, never by assigning state inside `$effect` (svelte/derived-not-effect).
- A top-level value that reads a prop is a `$derived`; a plain `const` keeps the first value (svelte/props-derived).
- Key each block that holds inputs, bindings, components or transitions by a unique id, never the index (svelte/each-key).
- Window and document events go on `<svelte:window>` and `<svelte:document>` (svelte/window-events); other listeners are removed on teardown (js/listener-cleanup).
- Use `$state` only for values that drive the UI; `$state.raw` for large data that is only replaced.
- Interactive elements are `<button>` and `<a>`, never `div` with `onclick` (a11y/no-click-on-static); every `<img>` has `alt` (a11y/img-alt).
- Fix every `a11y_*` compiler warning; silence one only with `<!-- svelte-ignore code -->` and a reason next to it.
- Never pass untrusted strings to `{@html}`; see `fe-security`.

## Do this

1. Check the profile: on Svelte 4 keep its syntax; on Svelte 5 write runes and convert legacy files when you touch them (`npx sv migrate svelte-5`).
2. Props: `let { title, count = 0, children, ...rest } = $props()`; two-way only with `$bindable()`. Events are callback props (`onsave`), not `createEventDispatcher`.
3. Shared reactive state lives in `.svelte.js` modules as classes with `$state` fields, or in context (`createContext`) when it is per request or per subtree; stores are for existing code.
4. Sync with a DOM library through an attachment (`{@attach chart}`) that returns its cleanup; `$effect` is the last resort and never writes the state it reads.
5. Style children through custom properties (`<Card --accent="tomato" />`); `:global` only for third-party markup, nested under a local selector.
6. Debug reactivity with `$inspect` and `$inspect.trace()`, and remove them before committing.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports legacy syntax, effects that should be derived, props read once, unkeyed stateful each blocks and hand-made window listeners.
- `npx sv check` (svelte-check) reports compiler warnings, including every `a11y_*` warning and `state_referenced_locally`; run it in CI with `--fail-on-warnings`.
- `eslint-plugin-svelte` adds `svelte/require-each-key`, `svelte/no-at-html-tags` and `svelte/prefer-writable-derived`.

## References

- [references/svelte.md](references/svelte.md): runes table, Svelte 4 to 5 mapping, snippets and attachments, state sharing, the a11y warnings worth knowing. Read it when converting a component, sharing state or fixing a reactivity bug.
