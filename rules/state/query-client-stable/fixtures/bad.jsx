import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function Providers({ children }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export const useTestClient = () => {
  return new QueryClient()
}
