import { LitElement, html } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import DOMPurify from 'dompurify'

// unsafeHTML(this.comment.body) in a comment is not code
const ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h12"/></svg>'

export class AcmeComment extends LitElement {
  static properties = { comment: { type: Object } }

  render() {
    return html`
      <div class="comment">${this.comment.body}</div>
      <div class="rich">${unsafeHTML(DOMPurify.sanitize(this.comment.html))}</div>
      <span>${unsafeHTML('<b>Pinned</b>')}</span>
    `
  }
}
customElements.define('acme-comment', AcmeComment)
export { ICON }
