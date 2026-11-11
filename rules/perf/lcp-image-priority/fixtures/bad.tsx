import Image from 'next/image'
import hero from './hero.jpg'

export default function Hero() {
  return <Image src={hero} alt="Autumn collection" preload loading="lazy" />
}
