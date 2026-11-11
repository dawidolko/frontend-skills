<template>
  <span :class="status">{{ label }}</span>
</template>

<script setup lang="ts">
const { status, label = 'Unknown' } = defineProps<{ status: 'open' | 'closed'; label?: string }>()
const columns = { props: ['not', 'a', 'component'] }
// defineProps(['in', 'a', 'comment'])
</script>

<script>
export default {
  name: 'StatusBadge',
  inheritAttrs: false,
  data: () => ({ table: { props: ['nested', 'is', 'fine'] } })
}
</script>
