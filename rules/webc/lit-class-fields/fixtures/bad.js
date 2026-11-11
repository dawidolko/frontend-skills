import { LitElement, html } from 'lit'

export class AcmeDisclosure extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    label: {}
  }

  open = false
  label

  render() {
    return html`<button type="button" aria-expanded=${this.open} @click=${() => (this.open = !this.open)}>${this.label}</button>`
  }
}
customElements.define('acme-disclosure', AcmeDisclosure)
