import { LitElement, css, html } from 'lit'

export class AcmePanel extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    :host([hidden]) {
      display: none;
    }
  `

  render() {
    return html`<slot></slot>`
  }
}
customElements.define('acme-panel', AcmePanel)
