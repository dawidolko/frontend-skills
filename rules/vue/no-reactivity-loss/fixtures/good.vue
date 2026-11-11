<template>
  <p>{{ count }} {{ form.name }} {{ title }}</p>
</template>

<script setup>
import { reactive, ref, toRefs } from 'vue'
const { title } = defineProps({ title: String })
const state = reactive({ count: 0 })
const { count } = toRefs(state)
const form = reactive({ name: '' })
const user = ref({ name: '' })
function reset() {
  Object.assign(form, { name: '' })
  user.value = { name: '' }
  const { name } = form.name ? { name: form.name } : { name: '' }
  return name === state.count
}
</script>
