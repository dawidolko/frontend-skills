<template>
  <p>{{ items.length }} items, {{ total }}</p>
  <button type="button" @click="addItem(product)">Add</button>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const props = defineProps({ product: Object })
const product = props.product
const { items, total, addItem } = useCartStore()
</script>
