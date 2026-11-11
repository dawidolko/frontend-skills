<template>
  <form @submit.prevent="onSubmit">
    <button type="submit">Order</button>
  </form>
</template>

<script setup lang="ts">
const form = reactive({ item: '' })
const { data: orders, refresh } = await useFetch('/api/orders')
function useOrderStats(id: Ref<string>) {
  return useAsyncData(`order-stats-${id.value}`, () => $fetch(`/api/orders/${id.value}/stats`))
}
const stats = useOrderStats(toRef(() => form.item))
onMounted(async () => {
  await useLazyFetch('/api/recommendations')
})
async function onSubmit(): Promise<void> {
  await $fetch('/api/orders', { method: 'POST', body: form })
  await refresh()
}
</script>
