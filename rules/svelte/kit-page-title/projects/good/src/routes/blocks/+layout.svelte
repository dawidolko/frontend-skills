<script>
  import Metadata from '#lib/Metadata.svelte'
  let { children } = $props()
</script>

<Metadata title="Blocks" />
{@render children()}
