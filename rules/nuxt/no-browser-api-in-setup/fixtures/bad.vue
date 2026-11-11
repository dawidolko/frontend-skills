<template>
  <div :data-theme="theme" :style="{ width: width + 'px' }"><slot /></div>
</template>

<script setup>
const theme = ref(localStorage.getItem('theme') ?? 'light')
const width = ref(window.innerWidth)
</script>
