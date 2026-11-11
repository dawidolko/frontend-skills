<script>
  import { onMount } from 'svelte'
  let { onclose } = $props()
  function onKey(event) {
    if (event.key === 'Escape') onclose()
  }
  onMount(() => {
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  $effect(() => {
    document.addEventListener('visibilitychange', onclose)
  })
</script>
