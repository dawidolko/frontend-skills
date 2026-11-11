<template>
  <ul class="gallery">
    <li v-for="p in products" :key="p.id">
      <img :src="p.image" :alt="p.name" width="400" height="400" loading="lazy">
    </li>
  </ul>
  <NuxtImg src="/hero.jpg" alt="Hero" :preload="{ fetchPriority: 'high' }" />
</template>
