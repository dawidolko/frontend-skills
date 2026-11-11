# Web components reference

Depth for the `fe-web-components` skill. Platform APIs from the HTML Standard and MDN; Lit 3 (latest stable checked 2026-11-11 on the npm registry: `lit` 3.3.3, BSD-3-Clause, about 6 kB min+gzip). Rule ids in brackets: `frontend-skills explain <id>`.

## Lifecycle

| Callback | Use it for | Never |
| --- | --- | --- |
| `constructor()` | `super()` first, default state, `attachShadow()`, `attachInternals()`, listeners on the shadow root | Read or add attributes or children [webc/constructor-no-attributes] |
| `connectedCallback()` | Read attributes, render, add listeners on `window`/`document`, start observers | Assume it runs once: it runs on every insert and move |
| `disconnectedCallback()` | Remove what `connectedCallback` added (one `AbortController`) [js/listener-cleanup] | Leave timers and observers running |
| `attributeChangedCallback(name, old, value)` | React to attributes listed in `static observedAttributes` | Reflect back to the same attribute (loop) |
| `connectedMoveCallback()` | Keep state when moved with `moveBefore()` | — |
| `formResetCallback()`, `formDisabledCallback()`, `formStateRestoreCallback()` | Form-associated controls | — |

Names [webc/valid-name]: lowercase ASCII first letter, a hyphen, no uppercase; reserved: `annotation-xml`, `color-profile`, `font-face`, `font-face-src`, `font-face-uri`, `font-face-format`, `font-face-name`, `missing-glyph`. Customized built-ins (`is=`, `extends`) do not work in Safari [webc/no-customized-builtins].

## Attributes, properties, events

| Data | As | Reflect |
| --- | --- | --- |
| string, number, boolean | attribute and property, kept in sync | when CSS or authors need it (`[open]`) |
| object, array | property only | never |
| Author-set `role`, `tabindex`, `class` | leave alone; defaults through `ElementInternals` | — |

Properties set before the definition loaded live on the instance: in `connectedCallback`, read them, `delete this[prop]`, and assign again so the setter runs.

Events: dispatch for changes the component caused (a click, a selection), not for a property the host just set. `bubbles: true` lets ancestors listen; `composed: true` lets the event cross shadow roots of other components. Name events in lowercase with a prefix (`acme-change`).

## Styling

```css
:host { display: block; }
:host([hidden]) { display: none; }
:host(:focus-within) { outline: 2px solid var(--acme-focus, Highlight); }
::slotted(img) { max-inline-size: 100%; }
```

- A host is `display: inline` by default; a `display` rule overrides `hidden`, hence the second line [webc/host-hidden].
- Theme through custom properties (`--acme-*`) and `::part(name)`; outer page styles win over `:host` rules.
- Expose states with `internals.states` and `:state(name)` instead of private classes on the host.

## Forms and accessibility

| Need | API |
| --- | --- |
| Value submitted with the form | `static formAssociated = true`; `internals.setFormValue(value)` [webc/form-associated] |
| `required`, custom errors | `internals.setValidity({ valueMissing: true }, message, anchorElement)`; `internals.reportValidity()` |
| Labels from the page | `<label for="host-id">` labels a form-associated host; `internals.labels` |
| Default role and states | `internals.role = 'switch'`, `internals.ariaChecked = 'true'` |
| Focus into the main control | `attachShadow({ mode: 'open', delegatesFocus: true })` |
| Label and control together | Both in the shadow root, or both in light DOM via `<slot>` [webc/aria-idrefs-same-tree] |
| Native behaviour | A real `<button>` or `<input>` inside the shadow root |

`ElementInternals` and `delegatesFocus` are Baseline widely available (MDN). Cross-root id references (`referenceTarget`) are being specified; do not rely on them yet. A closed shadow root is not a security boundary.

## Lit 3

| Topic | Do this |
| --- | --- |
| Reactive properties in JavaScript | `static properties = { open: { type: Boolean, reflect: true } }`; initial values in the constructor, no class fields [webc/lit-class-fields] |
| TypeScript decorators | `@property() accessor open = false` (standard decorators), or `useDefineForClassFields: false` with `experimentalDecorators` |
| Internal state | `@state()` or `{ state: true }`; not reflected |
| Arrays and objects | `this.items = [...this.items, item]` [webc/lit-immutable-updates] |
| Lists that reorder | `repeat(items, (i) => i.id, (i) => html`…`)`; plain `map` otherwise |
| Markup from data | Normal `${value}` expressions; `unsafeHTML` only after a sanitizer [webc/lit-unsafe-html] |
| Shadow root options | `static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }` |
| Styles | `static styles = css`…``; shared sheets as an array |
| One copy | Keep one version of `lit`, `lit-html` and `@lit/reactive-element` in the lockfile; production builds drop dev-mode warnings |

From Lit 2 to 3: IE11 support is gone and packages are published as ES2021 (old toolchains such as webpack 4 need Babel for `?.` and `??`); decorators are imported from `lit/decorators.js`, not `lit-element`; `UpdatingElement` is removed (use `ReactiveElement`); TypeScript 5.2 or newer is needed for the decorator types; standard decorators need `accessor` on decorated fields.

## Sources

- HTML Standard, Custom elements: https://html.spec.whatwg.org/multipage/custom-elements.html
- MDN, Using custom elements: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
- MDN, Using shadow DOM: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM
- MDN, ElementInternals: https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals
- MDN, ShadowRoot.delegatesFocus: https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus
- MDN, :host: https://developer.mozilla.org/en-US/docs/Web/CSS/:host
- web.dev, Custom element best practices: https://web.dev/articles/custom-elements-best-practices
- Lit, Reactive properties: https://lit.dev/docs/components/properties/
- Lit, Events: https://lit.dev/docs/components/events/
- Lit, Shadow DOM: https://lit.dev/docs/components/shadow-dom/
- Lit, Built-in directives: https://lit.dev/docs/templates/directives/
- Lit, Upgrade guide (Lit 2 to 3): https://lit.dev/docs/releases/upgrade/
- Lit, Development tools: https://lit.dev/docs/tools/development/
- npm registry, lit: https://registry.npmjs.org/lit
