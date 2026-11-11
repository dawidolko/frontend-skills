<template>
  <p>{{ name }} {{ fullName }}</p>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
const id = ref(1)
const user = ref(null)
const first = ref('')
const last = ref('')
watch(id, async (value) => {
  const res = await fetch(`/api/users/${value}`)
  if (res.ok) user.value = await res.json()
}, { immediate: true })
const name = computed(() => user.value?.name ?? '')
const fullName = computed({
  get: () => `${first.value} ${last.value}`,
  set: (value) => {
    ;[first.value, last.value] = value.split(' ')
  }
})
</script>
