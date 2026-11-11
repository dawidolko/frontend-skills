<template>
  <ul>
    <li v-for="(line, i) in lines" :key="i">{{ line.name }}</li>
    <li v-for="(tag, index) in tags" :key="`tag-${index}`">{{ tag }}</li>
  </ul>
</template>

<script setup>
defineProps({ lines: Array, tags: Array })
</script>
