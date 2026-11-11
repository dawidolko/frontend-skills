class AcmeToggle extends HTMLElement {
  static observedAttributes = ['label']

  constructor() {
    super()
    this.internals = this.attachInternals()
    this.internals.role = 'switch'
    const root = this.attachShadow({ mode: 'open' })
    root.innerHTML = '<button type="button"><slot></slot></button>'
    this.shadowRoot.querySelector('button').addEventListener('click', () => this.toggle())
    this.checked = false
  }

  connectedCallback() {
    this.label = this.getAttribute('label')
  }
}
customElements.define('acme-toggle', AcmeToggle)

class Store {
  constructor() {
    this.setAttribute = null
  }
}
