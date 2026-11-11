import { LitElement, html } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

export class AcmeComment extends LitElement {
  static properties = { comment: { type: Object } }

  render() {
    return html`<div class="comment">${unsafeHTML(this.comment.body)}</div>`
  }
}
customElements.define('acme-comment', AcmeComment)
