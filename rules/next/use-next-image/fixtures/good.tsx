import Image from 'next/image'
import team from './team.jpg'

export default function Team({ avatar, ...rest }: { avatar: string }) {
  return (
    <section {...rest}>
      <Image src={team} alt="The team at the 2026 retreat" placeholder="blur" />
      <Image src={avatar} alt="" width={40} height={40} />
      <picture>
        <source srcSet="/hero.avif" type="image/avif" />
        <img src="/hero.jpg" alt="Harbour at dawn" width={1200} height={600} />
      </picture>
    </section>
  )
}
