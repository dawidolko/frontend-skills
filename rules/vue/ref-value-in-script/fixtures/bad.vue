<template>
  <p v-if="isOpen">{{ count }}</p>
</template>

<script setup>
import { computed, ref } from 'vue'
const isOpen = ref(false)
const count = ref(0)
const doubled = computed(() => count * 2)
function toggle() {
  if (isOpen) isOpen.value = false
  return doubled === 0
}
</script>
