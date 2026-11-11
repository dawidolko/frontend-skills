---
id: svelte/kit-form-actions
title: A SvelteKit form posts to a form action (method and action) and is enhanced with use:enhance, not handled only by onsubmit.
severity: moderate
check: static
applies:
  - svelte
stack:
  - sveltekit
skill: fe-sveltekit
since: 0.1.0
sources:
  - title: SvelteKit docs, Form actions (progressive enhancement)
    url: https://svelte.dev/docs/kit/form-actions
---

## Why

A `<form onsubmit={...}>` with no `method` and `action` does nothing until the JavaScript has loaded, does nothing at all when it fails to load, and re-implements validation, pending state, errors and redirects by hand. SvelteKit's form actions work as a plain HTML post first and are enhanced on top.

## Fix

Give the form `method="POST"` and, for a named action, `action="?/create"`; handle it in `actions` of `+page.server.js`, return `fail(400, { values, errors })` for invalid input, and add `use:enhance` from `$app/forms` for a submit without a reload. A search or filter form uses `method="GET"` and reads `url.searchParams` in `load`. A form spread from a remote function (`<form {...createPost}>`) is fine.

## Examples

```svelte
<!-- bad -->
<form onsubmit={(e) => { e.preventDefault(); save(new FormData(e.currentTarget)) }}>
  <label>Title <input name="title" required /></label>
  <button>Save</button>
</form>
<!-- good -->
<script>
  import { enhance } from '$app/forms'
  let { form } = $props()
</script>
<form method="POST" action="?/create" use:enhance>
  <label>Title <input name="title" required value={form?.values?.title ?? ''} /></label>
  {#if form?.errors?.title}<p id="title-error">{form.errors.title}</p>{/if}
  <button>Save</button>
</form>
```
