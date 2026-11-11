<template>
  <p>{{ count }} {{ form.name }}</p>
</template>

<script setup>
import { reactive } from 'vue'
const state = reactive({ count: 0 })
const { count } = state
let form = reactive({ name: '' })
function reset() {
  form = reactive({ name: '' })
}
</script>
