<template>
  <ul>
    <li v-for="(line, i) in lines" :key="line.sku" :data-position="i">{{ line.name }}</li>
    <li v-for="(value, name) in settings" :key="name">{{ value }}</li>
    <li v-for="(value, name, index) in settings" :key="`${name}-${value}`" :data-index="index">{{ value }}</li>
    <li v-for="n in 5" :key="n">{{ n }}</li>
  </ul>
</template>

<script setup>
defineProps({ lines: Array, settings: Object })
</script>
