<template>
  <section>
    <img src="./assets/hero.jpg" alt="Harbour at dawn" width="1200" height="600" />
    <img src="@/assets/team.webp" alt="The team" width="800" height="400" />
    <img :src="avatarUrl" alt="" width="40" height="40" />
    <img src="https://cdn.example.com/map.png" alt="Map of the area" width="600" height="400" />
    <img src="/icons/close.svg" alt="" width="16" height="16" />
    <NuxtImg src="/images/hero.jpg" alt="Harbour" width="1200" height="600" />
  </section>
</template>

<script setup>
const avatarUrl = new URL('./assets/avatar.png', import.meta.url).href
</script>
