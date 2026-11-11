<template>
  <p v-if="todo.isPending.value">Loading…</p>
  <p v-else-if="todo.isError.value">{{ todo.error.value.message }}</p>
  <p v-else>{{ todo.data.value.title }} ({{ list.data.value?.length }})</p>
</template>

<script setup>
import { useQuery, queryOptions } from '@tanstack/vue-query'
import { api, getTodos } from './api'

const BASE = '/api'
const props = defineProps({ todoId: String, status: String })
const todoId = toRef(props, 'todoId')

const todo = useQuery({
  queryKey: ['todo', todoId],
  queryFn: ({ signal }) => api.getTodo(todoId.value, { signal }),
})
const list = useQuery({
  queryKey: ['todos', { status: props.status }],
  queryFn: async ({ queryKey: [, filters] }) => {
    const res = await fetch(`${BASE}/todos?status=${filters.status}`)
    if (!res.ok) throw new Error(`Failed: ${res.status}`)
    return (await res.json()).map((item) => ({ ...item, done: Boolean(item.done) }))
  },
})
const options = queryOptions({ queryKey: ['todos', 'all'], queryFn: getTodos })
const keyed = useQuery({ queryKey: todoKey, queryFn: () => api.getTodo(other) })
</script>
