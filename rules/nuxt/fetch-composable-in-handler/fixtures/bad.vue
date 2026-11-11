<template>
  <form @submit.prevent="onSubmit">
    <button type="submit">Order</button>
  </form>
</template>

<script setup>
const form = reactive({ item: '' })
async function onSubmit() {
  if (form.item) {
    const { data } = await useFetch('/api/orders', { method: 'POST', body: form })
    return data
  }
}
const reload = async () => {
  await useAsyncData('orders', () => $fetch('/api/orders'))
}
</script>
