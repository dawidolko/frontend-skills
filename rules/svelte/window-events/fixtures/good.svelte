<script>
  import { onMount } from 'svelte'
  let { onclose, chart } = $props()
  let width = $state(0)
  function onKey(event) {
    if (event.key === 'Escape') onclose()
  }
  onMount(() => {
    chart.addEventListener('click', onclose)
    return () => chart.removeEventListener('click', onclose)
  })
  // window.addEventListener('keydown', onKey) was the old way
</script>

<svelte:window onkeydown={onKey} bind:innerWidth={width} />
<svelte:document onvisibilitychange={onclose} />
