<template>
  <button type="button" @click="add('x')">Add</button>
</template>

<script setup>
const props = defineProps({ items: Array, count: Number, filter: Object })
function add(item) {
  props.items.push(item)
  props.count++
  props.filter.query = item
}
</script>
