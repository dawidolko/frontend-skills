<template>
  <ul>
    <li v-for="todo in todos">{{ todo.title }}</li>
  </ul>
  <TodoCard v-for="todo in todos" :todo="todo" />
</template>

<script setup>
defineProps({ todos: { type: Array, required: true } })
</script>
