<template>
  <p>{{ user }} {{ total }} {{ label }}</p>
</template>

<script setup>
import { computed, ref } from 'vue'
const id = ref(1)
const calls = ref(0)
const user = computed(async () => (await fetch(`/api/users/${id.value}`)).json())
const total = computed(() => {
  calls.value++
  return id.value * 2
})
const label = computed(() => fetch('/api/label'))
</script>
