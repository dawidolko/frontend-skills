<script>
  // export let count is the old way
  let { count = $bindable(), children, icon: Icon } = $props()
  let double = $derived(count * 2)
  const label = 'use on:click? no'
  const total = { $: 1 }
  const prices = {
    $: 2
  }
</script>

<button onclick={() => count++} aria-label={label}>{double} {total.$} {prices.$}</button>
<Icon />
{@render children?.()}
