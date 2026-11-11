<template>
  <p>{{ total }}</p>
</template>

<script setup>
const props = defineProps({ a: Number, b: Number })
const total = eval(`${props.a} + ${props.b}`)
setTimeout('refresh()', 1000)
const compute = new Function('a', 'b', 'return a * b')
</script>
