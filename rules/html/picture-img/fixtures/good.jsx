export function Hero({ children }) {
  return (
    <>
      <picture>
        <source type="image/avif" srcSet="hero.avif" />
        <img src="hero.jpg" alt="Autumn collection" width="1600" height="900" />
      </picture>
      <picture>
        <source media="(width >= 48em)" srcSet="wide.avif" />
        {children}
      </picture>
    </>
  )
}
