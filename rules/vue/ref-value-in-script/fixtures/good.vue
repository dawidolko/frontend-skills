<template>
  <p v-if="isOpen && count > 0">{{ count + 1 }}</p>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
const isOpen = ref<boolean>(false)
const count = ref(0)
const doubled = computed(() => count.value * 2)
const input = useTemplateRef<HTMLInputElement>('input')
watch(count, (value) => console.log(value))
const state = { isOpen, count: count.value + 1 }
function toggle(count: number) {
  if (isOpen.value) isOpen.value = false
  input.value?.focus()
  return doubled.value === 0 || !isOpen.value
}
defineExpose({ isOpen, toggle })
</script>
