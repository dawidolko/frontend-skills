<template>
  <form @submit.prevent="subscribe">
    <p v-for="product in products" :key="product.id">{{ product.name }}</p>
    <button type="submit">Subscribe</button>
  </form>
</template>

<script setup lang="ts">
const { data: products } = await useFetch('/api/products')
const { data: stats } = await useAsyncData('stats', () => $fetch('/api/stats'))
// const old = await $fetch('/api/old')
async function subscribe() {
  await $fetch('/api/subscribe', { method: 'POST' })
}
</script>
