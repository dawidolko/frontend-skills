class AcmeToggle extends HTMLElement {
  constructor() {
    super()
    this.setAttribute('role', 'switch')
    this.label = this.getAttribute('label')
  }
}
customElements.define('acme-toggle', AcmeToggle)
