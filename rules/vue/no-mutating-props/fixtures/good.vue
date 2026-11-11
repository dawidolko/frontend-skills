<template>
  <button type="button" @click="add('x')">Add {{ draft }}</button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
const props = withDefaults(defineProps<{ items: string[]; count?: number }>(), { count: 0 })
const emit = defineEmits<{ add: [item: string] }>()
const draft = ref(props.count)
const sorted = computed(() => [...props.items].sort())
const total = computed(() => props.count === 0 ? props.items.length : props.count)
function add(item: string) {
  draft.value++
  emit('add', item)
  return sorted.value.includes(item) && total.value
}
</script>
