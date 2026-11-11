<template>
  <ul>
    <li v-for="todo in todos" :key="todo.id">{{ todo.title }}</li>
    <template v-for="group in groups" :key="group.id">
      <li>{{ group.name }}</li>
    </template>
    <template v-for="row in rows">
      <li :key="row.id">{{ row.name }}</li>
    </template>
  </ul>
  <TodoCard v-for="todo in todos" v-bind="cardProps(todo)" />
</template>

<script setup>
defineProps({ todos: Array, groups: Array, rows: Array })
const cardProps = (todo) => ({ key: todo.id, todo })
</script>
