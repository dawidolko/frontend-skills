import { LitElement, css, html } from 'lit'

export class AcmePanel extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: var(--space-4);
    }
  `

  render() {
    return html`<slot></slot>`
  }
}
customElements.define('acme-panel', AcmePanel)
