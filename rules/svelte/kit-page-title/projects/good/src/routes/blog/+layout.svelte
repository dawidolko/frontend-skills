<script>
  import { page } from '$app/state'
  let { children } = $props()
</script>

<svelte:head>
  <title>{page.data.title} – Blog</title>
</svelte:head>

{@render children()}
