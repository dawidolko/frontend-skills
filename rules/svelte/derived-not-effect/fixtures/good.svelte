<script>
  let { items, title, canvas } = $props()
  let visible = $derived(items.filter((item) => !item.hidden))
  let count = $state(0)
  let width = $state(0)
  $effect(() => {
    document.title = `${title} (${visible.length})`
  })
  $effect(() => {
    const ctx = canvas.getContext('2d')
    ctx.fillRect(0, 0, width, 10)
  })
  $effect(() => {
    if (count > 10) count = 10
  })
</script>

<button onclick={() => count++}>{count}</button>
<div bind:clientWidth={width}></div>
