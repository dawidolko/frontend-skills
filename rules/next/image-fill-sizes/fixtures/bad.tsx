import Picture from 'next/image'

export function ProductCard({ product }: { product: { name: string; photo: string } }) {
  return (
    <article className="relative aspect-square">
      <Picture src={product.photo} alt={product.name} fill className="object-cover" />
    </article>
  )
}
