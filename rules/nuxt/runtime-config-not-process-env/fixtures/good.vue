<template>
  <a :href="api">API</a>
</template>

<script setup>
const api = useRuntimeConfig().public.apiBase
const note = 'set process.env.API_URL in the platform'
// process.env.OLD is not code
if (import.meta.client) {
  console.info('client', note)
}
</script>
