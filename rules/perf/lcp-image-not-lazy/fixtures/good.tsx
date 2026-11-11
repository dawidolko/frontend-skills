export function Page({ src, loading }: { src: string; loading: 'lazy' | 'eager' }) {
  return (
    <main>
      <img className="hero-image" src="/img/hero.avif" alt="Team at work" width={1600} height={900} fetchPriority="high" />
      <img src="/img/gallery-1.webp" alt="Gallery" width={400} height={300} loading="lazy" />
      <img className="hero-image" src={src} alt="" width={1600} height={900} loading={loading} />
      <img className="heroic-quote" src="/img/quote.png" alt="" width={20} height={20} loading="lazy" />
    </main>
  )
}
