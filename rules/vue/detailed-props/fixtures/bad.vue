<template>
  <span :class="status">{{ label }}</span>
</template>

<script setup>
const props = defineProps(['status', 'label'])
</script>

<script>
export default {
  name: 'StatusBadge',
  props: ['status', 'label']
}
</script>
