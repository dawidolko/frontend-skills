import { LitElement, html } from 'lit'

export class AcmeTodoList extends LitElement {
  static properties = { items: { state: true } }

  constructor() {
    super()
    this.items = []
    this.log = []
  }

  add(title) {
    this.items = [...this.items, { id: crypto.randomUUID(), title }]
    this.log.push(title)
  }

  sortInPlace() {
    this.items.sort((a, b) => a.title.localeCompare(b.title))
    this.requestUpdate()
  }

  render() {
    const sorted = [...this.items].sort((a, b) => a.title.localeCompare(b.title))
    return html`<ul>${sorted.map((item) => html`<li>${item.title}</li>`)}</ul>`
  }
}
customElements.define('acme-todo-list', AcmeTodoList)
