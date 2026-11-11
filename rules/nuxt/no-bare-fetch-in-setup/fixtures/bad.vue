<template>
  <ul>
    <li v-for="product in products" :key="product.id">{{ product.name }}</li>
  </ul>
</template>

<script setup lang="ts">
const products = await $fetch<Product[]>('/api/products')
</script>
