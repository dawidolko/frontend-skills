<template>
  <ul v-if="users.length">
    <template v-for="user in activeUsers" :key="user.id">
      <li v-if="user.visible">{{ user.name }}</li>
    </template>
  </ul>
  <p v-else>No users yet.</p>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ users: Array })
const activeUsers = computed(() => props.users.filter((u) => u.active))
</script>
