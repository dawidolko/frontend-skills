import { LitElement, html } from 'lit'

export class AcmeTodoList extends LitElement {
  static properties = { items: { state: true } }

  constructor() {
    super()
    this.items = []
  }

  add(title) {
    this.items.push({ id: crypto.randomUUID(), title })
  }

  render() {
    return html`<ul>${this.items.map((item) => html`<li>${item.title}</li>`)}</ul>`
  }
}
customElements.define('acme-todo-list', AcmeTodoList)
