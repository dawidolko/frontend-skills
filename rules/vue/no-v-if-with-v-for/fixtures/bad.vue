<template>
  <ul>
    <li v-for="user in users" v-if="user.active" :key="user.id">{{ user.name }}</li>
  </ul>
</template>

<script setup>
defineProps({ users: Array })
</script>
