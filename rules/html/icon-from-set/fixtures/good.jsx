import { Icon } from './Icon'
import logo from './assets/logo.svg'

export function Header({ avatarUrl, iconUrl }) {
  return (
    <header>
      <link rel="icon" href="/icons/favicon.svg" />
      <img src={logo} alt="Harbour Books" width="120" height="32" />
      <img src="/images/team.jpg" alt="The team" width="800" height="400" />
      <img src={avatarUrl} alt="" width="40" height="40" />
      <img src={iconUrl} alt="" width="16" height="16" />
      <Icon name="close" />
      <svg aria-hidden="true"><use href="#icon-cart" /></svg>
    </header>
  )
}
