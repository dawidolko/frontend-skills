# Svelte reference

Depth for the `fe-svelte` skill, for Svelte 5 (latest stable checked 2026-11-11 on the npm registry: 5.57.3; Svelte 5.0 shipped in October 2024). Rule ids in brackets: `frontend-skills explain <id>`.

## Runes

| Rune | Use | Avoid |
| --- | --- | --- |
| `$state(value)` | Values the template, a derived or an effect reads | Wrapping constants or values nothing reacts to |
| `$state.raw(value)` | Large API results that are replaced, not mutated | Mutating it in place (no update happens) |
| `$derived(expr)` / `$derived.by(fn)` | Every value computed from state or props [svelte/derived-not-effect] [svelte/props-derived] | Side effects inside it |
| `$effect(fn)` | Work outside Svelte: canvas, third-party widgets, logging | Writing state it reads (loops: `effect_update_depth_exceeded`) |
| `$props()` | `let { a, b = 1, children, ...rest } = $props()` | Copying a prop into a plain `let` |
| `$bindable()` | A prop the parent may bind with `bind:value` | Making every prop bindable |
| `$inspect(x)`, `$inspect.trace()` | Debugging what changed and why | Leaving them in committed code |

Effects run only in the browser, so `if (browser)` inside an effect is not needed.

## From Svelte 4 to Svelte 5 [svelte/no-legacy-syntax]

| Svelte 4 | Svelte 5 |
| --- | --- |
| `let count = 0` (implicitly reactive) | `let count = $state(0)` |
| `export let title` | `let { title } = $props()` |
| `$: double = count * 2` | `let double = $derived(count * 2)` |
| `$: if (x) doSomething()` | the event handler that changes `x`; `$effect` only for outside work |
| `on:click={f}`, `on:click\|preventDefault` | `onclick={f}`; call `event.preventDefault()` in `f` |
| `createEventDispatcher()` | callback props: `let { onsave } = $props()` |
| `<slot />`, `<slot name="footer" />` | `{@render children?.()}`, `{@render footer?.()}` with snippet props |
| `<svelte:fragment slot="x">` | `{#snippet x()}...{/snippet}` |
| `<svelte:component this={C} />` | `<C />` |
| `<svelte:self />` | import the component and render it by name |
| `use:action` | `{@attach fn}` (returns a cleanup) |
| `class:active={on}` | `class={['item', { active: on }]}` |
| `writable()` store for shared state | a class with `$state` fields in a `.svelte.js` module |
| `$$props`, `$$restProps` | `let { a, ...rest } = $props()` |

Convert with `npx sv migrate svelte-5`, then review: the tool keeps behaviour, not intent (for example it may turn `$:` into `$effect` where `$derived` fits).

## Snippets, attachments, styling

- Snippets are declared in markup and passed as props; a component that wraps content receives `children` automatically.
- A snippet that uses no component state can be exported from `<script module>`.
- Attachments: `{@attach (node) => { const chart = new Chart(node); return () => chart.destroy() }}`.
- CSS from script: `style:--columns={columns}` and `var(--columns)` in `<style>`.

## Lists [svelte/each-key]

- `{#each items as item (item.id)}`: the key is unique and comes from the data.
- Avoid destructuring an item you mutate (`bind:value={item.count}` needs `item`).
- `{#key value}` remounts everything inside; use it for a deliberate restart (a transition), not to refresh values.

## Sharing state

| Need | Use |
| --- | --- |
| Parent to child | props |
| Child to parent | callback props, `$bindable` |
| A subtree or one request (SSR) | `createContext()` (typed) or `setContext`/`getContext` |
| App-wide client state | a class with `$state` fields exported from a `.svelte.js` module |
| URL-worthy state (filters, tabs) | the URL; see `fe-sveltekit` |

Module-level state is shared by every request during server rendering; keep per-user data in context or in the server's `locals`.

## Accessibility warnings worth knowing

The compiler checks markup and prints `a11y_*` warnings; `npx sv check` shows them. Common ones: `a11y_click_events_have_key_events` and `a11y_no_static_element_interactions` (use a `<button>`), `a11y_missing_attribute` (`alt`, `href`, `title` on iframes), `a11y_label_has_associated_control`, `a11y_media_has_caption`, `a11y_autofocus`, `a11y_positive_tabindex`, `a11y_no_noninteractive_tabindex`, `a11y_role_has_required_aria_props`, `a11y_unknown_aria_attribute`. They find part of the problems only; check focus order and screen reader output by hand.

## Tooling

| Tool | What it adds |
| --- | --- |
| `npx sv check` (svelte-check 4) | Type errors, compiler and a11y warnings, unused CSS |
| `eslint-plugin-svelte` 3 | `svelte/valid-compile`, `require-each-key`, `no-at-html-tags`, `prefer-writable-derived`, `no-unused-svelte-ignore`, `button-has-type` |
| Svelte MCP server | Official docs and an autofixer for agents (`npx -y @sveltejs/mcp`) |

## Sources

- Svelte best practices: https://svelte.dev/docs/svelte/best-practices
- $state, $derived, $effect, $props: https://svelte.dev/docs/svelte/$effect, https://svelte.dev/docs/svelte/$derived, https://svelte.dev/docs/svelte/$props
- Svelte 5 migration guide: https://svelte.dev/docs/svelte/v5-migration-guide
- Each blocks: https://svelte.dev/docs/svelte/each
- Snippets: https://svelte.dev/docs/svelte/snippet
- svelte:window: https://svelte.dev/docs/svelte/svelte-window
- Compiler warnings: https://svelte.dev/docs/svelte/compiler-warnings
- sv check: https://svelte.dev/docs/cli/sv-check
- npm registry, svelte: https://registry.npmjs.org/svelte/latest
