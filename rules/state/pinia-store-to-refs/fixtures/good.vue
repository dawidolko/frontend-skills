<template>
  <p>{{ items.length }} items, {{ cart.total }} ({{ count }})</p>
  <button type="button" @click="addItem(product)">Add</button>
  <button type="button" @click="clear">Clear</button>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'

const props = defineProps({ product: Object })
const product = props.product
const cart = useCartStore()
const { items } = storeToRefs(cart)
const { addItem, clear } = cart
const { count } = storeToRefs(useUserStore())
const { logout } = useUserStore()
logout()
</script>
