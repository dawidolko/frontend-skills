import Image from 'next/image'

export function ProductCard({ product, imageProps }: { product: { name: string; photo: string }; imageProps: object }) {
  return (
    <article className="relative aspect-square">
      <Image src={product.photo} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" />
      <Image src={product.photo} alt="" fill {...imageProps} />
      <Image src={product.photo} alt="" fill={false} width={64} height={64} />
      <Image src={product.photo} alt="" width={64} height={64} />
    </article>
  )
}
