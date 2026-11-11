export function useProduct(id) {
  return useAsyncData(() => `product-${id.value}`, () => $fetch(`/api/products/${id.value}`))
}

export function useCategories() {
  return useAsyncData('categories', () => $fetch('/api/categories'))
}

export default defineNuxtPlugin(() => {
  useAsyncData(() => $fetch('/api/config'))
})
