<script>
  import { enhance } from '$app/forms'
  import { createPost } from './posts.remote'
  let { form, onclose, send } = $props()
  let message = $state('')
</script>

<form method="POST" action="?/create" use:enhance>
  <label>Title <input name="title" required value={form?.values?.title ?? ''} /></label>
  <button>Save</button>
</form>

<form method="GET" onsubmit={() => onclose()}>
  <label>Search <input type="search" name="q" /></label>
</form>

<form {...createPost}>
  <label>Body <textarea name="body"></textarea></label>
  <button>Post</button>
</form>

<form method="dialog" onsubmit={onclose}>
  <button>Close</button>
</form>

<form onsubmit={(event) => { event.preventDefault(); send(message) }}>
  <label>Message <input bind:value={message} /></label>
</form>
