import { reactive, ref } from 'vue'

export const user = ref(null)
const cart = reactive({ items: [] })

export function useCart() {
  return cart
}
