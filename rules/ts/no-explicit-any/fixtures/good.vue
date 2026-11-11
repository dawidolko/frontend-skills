<template>
  <p>Pick: any of these, or none. {{ total }}</p>
</template>

<script setup lang="ts">
// items: any[] in a comment is not code
const props = defineProps<{ items: { price: number }[] }>()
const label = 'value as any'
const total = props.items.reduce((sum, item) => sum + item.price, 0)
function toError(err: unknown) {
  return err instanceof Error ? err : new Error(String(err), { cause: err })
}
const anyway = [1].some((n) => n > 0)
</script>
