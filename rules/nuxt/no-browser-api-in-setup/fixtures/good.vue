<template>
  <div :data-theme="theme" :style="{ width: width + 'px' }"><slot /></div>
</template>

<script setup>
const theme = useCookie('theme', { default: () => 'light' })
const width = ref(0)
const saved = import.meta.client ? localStorage.getItem('saved') : null
const options = { window: 30, document: 'a' }
onMounted(() => {
  width.value = window.innerWidth
  window.addEventListener('resize', () => (width.value = window.innerWidth))
})
function share() {
  return navigator.share?.({ url: location.href })
}
if (import.meta.client) {
  document.title = 'Ready'
}
</script>
