<script lang="ts">
  import { untrack } from 'svelte'
  let { size = 'small', price, value, items }: { size?: string; price: number; value: string; items: string[] } = $props()
  const label = $derived(size === 'small' ? 'S' : 'L')
  let draft = $state(untrack(() => value))
  const format = (n: number) => `${n.toFixed(2)} ${size}`
  function total() {
    const sum = price * 2
    return sum
  }
  const options = { size: 'large' }
  const sizes = ['small', 'large']
  const initialValue = value
  // svelte-ignore state_referenced_locally
  const cached = sizes.includes(size)
</script>

<span>{label} {format(price)} {total()} {draft} {options.size} {sizes.length} {items.length} {initialValue} {cached}</span>
