<template>
  <a :href="api">API</a>
</template>

<script setup>
const api = process.env.API_URL
if (process.client) {
  console.info('client')
}
</script>
