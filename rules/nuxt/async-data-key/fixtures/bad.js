export function useProduct(id) {
  return useAsyncData(() => $fetch(`/api/products/${id.value}`))
}

export const useReviews = (id) => {
  return useLazyAsyncData(async () => $fetch(`/api/products/${id.value}/reviews`))
}
