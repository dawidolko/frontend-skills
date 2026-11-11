import { LitElement, html } from 'lit'

export class AcmeDisclosure extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    label: {}
  }

  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  #timer = null
  count = 0

  constructor() {
    super()
    this.open = false
    this.label = ''
  }

  toggle() {
    this.open = !this.open
  }

  render() {
    return html`<button type="button" aria-expanded=${this.open} @click=${this.toggle}>${this.label}</button>`
  }
}
customElements.define('acme-disclosure', AcmeDisclosure)
