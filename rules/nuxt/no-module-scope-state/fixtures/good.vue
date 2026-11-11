<template>
  <p>{{ user?.name }} {{ open }}</p>
</template>

<script>
export const PAGE_SIZE = 20
export function makeCounter() {
  const count = ref(0)
  return count
}
</script>

<script setup>
const open = ref(false)
const user = useState('user', () => null)
</script>
