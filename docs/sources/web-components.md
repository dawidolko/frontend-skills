# Web components (custom elements, shadow DOM, Lit): sources and candidate rules

Read on 2026-11-11. Primary sources:

- HTML Standard, Custom elements (https://html.spec.whatwg.org/multipage/custom-elements.html): §4.13.2 "Requirements for custom element constructors and reactions", "valid custom element name"
- MDN: Using custom elements (https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements), ElementInternals (https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals), Element.attachShadow() (https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow), ShadowRoot.delegatesFocus (https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus), Using shadow DOM (https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
- web.dev, Custom element best practices (https://web.dev/articles/custom-elements-best-practices) — page says last updated 2017-08-14; still the official checklist, but old
- Lit docs: properties (https://lit.dev/docs/components/properties/), events (https://lit.dev/docs/components/events/), shadow DOM (https://lit.dev/docs/components/shadow-dom/), built-in directives (https://lit.dev/docs/templates/directives/), expressions (https://lit.dev/docs/templates/expressions/), SSR (https://lit.dev/docs/ssr/overview/), development tools (https://lit.dev/docs/tools/development/)
- npm registry: `lit`, `@lit-labs/ssr`, `eslint-plugin-lit`, `eslint-plugin-wc`, `lit-analyzer`; bundlephobia (https://bundlephobia.com/package/lit@3.3.3)

## Version and status (verified 2026-11-11)

| package | latest | published | licence (registry) | size |
|---|---|---|---|---|
| `lit` | 3.3.3 | 2026-05-14 | BSD-3-Clause | 15,455 B min / 6,024 B min+gzip, 3 deps (bundlephobia API, 2026-11-11) |
| `@lit-labs/ssr` | 4.1.0 | 2026-05-14 | BSD-3-Clause | Labs = experimental (https://lit.dev/docs/ssr/overview/) |
| `eslint-plugin-lit` | 2.3.1 | 2026-05-11 | MIT | recommended by lit.dev tools page |
| `eslint-plugin-wc` | 3.1.0 | 2026-02-09 | MIT | community; not referenced by the sources above |
| `lit-analyzer` | 2.0.3 | 2024-01-09 | MIT | CLI behind lit-plugin; last release 2024 |

Lit 3.0.0 published 2023-10-10 (registry). Platform status from MDN on 2026-11-11: `ElementInternals` Baseline widely available (across browsers since March 2023); `delegatesFocus` Baseline widely available (since November 2021); Safari does not plan to support customized built-in elements (`is=`).

## Detection (for stack detection)

| signal | meaning |
|---|---|
| `customElements.define(` in JS/TS; classes `extends HTMLElement` | vanilla custom elements |
| `lit` (or `lit-element`/`lit-html`) in deps; `extends LitElement`; `@customElement('x-y')` decorator; `html\`` tagged templates from `lit` | Lit |
| `attachShadow(` / `<template shadowrootmode="open">` | shadow DOM (imperative / declarative) |
| `static formAssociated = true` / `attachInternals()` | form-associated custom element |
| `<svelte:options customElement=…>`, Angular `@angular/elements`, Vue `defineCustomElement` | framework-built custom elements (Angular/Vue names Not verified in this pass) |
| `custom-elements.json` | custom elements manifest (Not verified as a standard file name in primary docs) |

## Definition and lifecycle

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| wc/valid-name | Name elements in lowercase, starting with a letter, with at least one hyphen, and not one of the reserved names (e.g. `font-face`, `annotation-xml`). | Otherwise `define()` throws and the parser may treat the tag as text. | https://html.spec.whatwg.org/multipage/custom-elements.html (valid custom element name); MDN Using custom elements | any | static: first arg of `customElements.define` / `@customElement` | `'MyButton'` → `'my-button'` | – | error |
| wc/constructor-rules | Call `super()` first in the constructor, and do not read or add attributes or children there; do setup that needs them in `connectedCallback`. | Spec conformance; elements created by `createElement` have no attributes yet. | https://html.spec.whatwg.org/multipage/custom-elements.html (§4.13.2); https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements | vanilla CE | static: `this.getAttribute`/`this.setAttribute`/`appendChild` on `this` inside `constructor` | move to `connectedCallback()` | – | error |
| wc/cleanup-on-disconnect | Remove global listeners, observers and timers in `disconnectedCallback` (or use `connectedMoveCallback` with `moveBefore()` to keep state on moves). | Callbacks fire on every insert/remove, including moves. | https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements (lifecycle callbacks) | vanilla CE | static: `window.addEventListener` in `connectedCallback` without matching remove | – | – | warning |
| wc/observed-attributes | List every attribute you react to in `static observedAttributes`. | `attributeChangedCallback` fires only for listed names. | MDN Using custom elements ("Responding to attribute changes") | vanilla CE | static: attribute names read in `attributeChangedCallback` vs list | – | – | warning |
| wc/no-customized-builtins | Prefer autonomous custom elements (or composition around a native element) over customized built-ins with `is=`. | Safari does not plan to support them; scoped registries reject `extends`. | MDN Using custom elements | any | static: `define(..., { extends: ` / `is="` | `<button is="x-btn">` → `<x-btn>` wrapping `<button>` | – | warning |
| wc/upgrade-lazy-properties | Capture properties set before the element upgraded and re-apply them through the setter. | Frameworks may set properties before the definition loads. | https://web.dev/articles/custom-elements-best-practices ("Make properties lazy") | vanilla CE | manual | – | – | info |

## Attributes, properties and events

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| wc/primitive-attr-and-prop | Accept strings/numbers/booleans as both attribute and property and keep them in sync; accept objects/arrays only as properties and do not reflect them. | Works from markup and JS like native elements; serializing rich data is costly. | https://web.dev/articles/custom-elements-best-practices (Attributes and properties) | any | manual / static (property with `reflect: true` and `type: Object|Array` in Lit) | – | – | info |
| wc/no-reentrancy | Reflect property → attribute in the setter and only handle side effects in `attributeChangedCallback`, avoiding a set-reflect-set loop. | Prevents infinite loops. | https://web.dev/articles/custom-elements-best-practices ("Avoid reentrancy issues") | vanilla CE | manual | – | – | warning |
| wc/respect-author-attributes | Do not overwrite author-set global attributes (`tabindex`, `role`, `class`) on the host; set defaults only when absent, and never self-apply classes. | Authors may set them on purpose. | https://web.dev/articles/custom-elements-best-practices ("Don't override the page author", "Do not self-apply classes") | any | static: `this.setAttribute('tabindex'|'role'` without `hasAttribute` guard; `this.classList.add` | `this.setAttribute('role','button')` → `this.internals.role = 'button'` (see wc/internals-default-semantics) | – | warning |
| wc/events-for-internal-changes | Dispatch events for changes the component itself causes, not for property values the host just set. | Downward data flow events can loop with bindings. | https://web.dev/articles/custom-elements-best-practices (Events) | any | manual | – | – | info |
| wc/composed-events | Set `bubbles: true, composed: true` on events that consumers outside the shadow root must hear. | Non-composed events stop at the shadow boundary. | https://lit.dev/docs/components/events/ ("Understanding composed event dispatching") | any | static: `new CustomEvent(` without `composed` in shadow-DOM components | – | – | warning |
| wc/lit-immutable-updates | In Lit, replace objects/arrays instead of mutating them (or call `requestUpdate()`). | Mutation does not change the reference, so no update happens. | https://lit.dev/docs/components/properties/ ("Mutating object and array properties") | Lit | static: `this.items.push(` on a reactive property | `this.items.push(x)` → `this.items = [...this.items, x]` | – | warning |
| wc/lit-no-class-field-shadowing | Do not declare Lit reactive properties as plain JS class fields; in TS set `useDefineForClassFields: false` or use `declare`/`accessor`. | Class fields shadow Lit's accessors and break reactivity. | https://lit.dev/docs/components/properties/ ("Avoiding issues with class fields") | Lit | static: tsconfig flag; JS class fields matching `static properties` keys | – | – | error |
| wc/lit-repeat-keys | Use `repeat()` with a key function for lists that reorder or change, plain `map` otherwise. | Keeps DOM-to-item association. | https://lit.dev/docs/templates/directives/ (`repeat`) | Lit | manual | – | – | info |

## Shadow DOM and styling

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| wc/shadow-in-constructor | Create the shadow root in the constructor and put generated children inside it; project consumer content with `<slot>`. | Encapsulates styles and protects internals; slotted content stays usable without JS. | https://web.dev/articles/custom-elements-best-practices (Shadow DOM) | vanilla CE | static: `attachShadow` inside `connectedCallback` | – | – | info |
| wc/host-display-and-hidden | Give `:host` a display value (default is inline) and add `:host([hidden]) { display: none }`. | Inline hosts ignore width/height; a display rule overrides `hidden`. | https://web.dev/articles/custom-elements-best-practices (`:host` display items) | any | static: shadow styles with `:host { display:` but no `:host([hidden])` | – | – | warning |
| wc/no-ssr-without-dsd | Do not expect content inside shadow roots to appear before JS runs unless it is server-rendered as declarative shadow DOM (`<template shadowrootmode>`); treat Lit SSR as experimental. | Otherwise content is invisible until upgrade (SEO, LCP). | https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow (declarative `shadowrootmode`); https://lit.dev/docs/ssr/overview/ (Labs) | any | manual / runtime: view-source shows empty host | – | `@lit-labs/ssr@4.1.0`, BSD-3-Clause (experimental) | info |
| wc/closed-not-security | Do not treat `mode: "closed"` as a security boundary. | Script can still keep the returned root. | https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow ("Open and closed shadow roots") | any | static: `mode: 'closed'` (info) | – | – | info |

## Accessibility (forms, focus, ARIA across roots)

Helps you work to WCAG 2.2 AA; automated tools often cannot see inside shadow roots correctly, so keyboard and screen-reader testing by a person is needed.

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| wc/form-associated | Make custom form controls form-associated (`static formAssociated = true` + `attachInternals()`) and report value and validity with `setFormValue()` and `setValidity()`. | Lets them submit with forms, take part in constraint validation and get `labels`. | https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals (methods `setFormValue`, `setValidity`, `reportValidity`, `labels`; example) | any | static: element named like an input that dispatches `change` but has no `formAssociated` | hidden `<input>` mirror → `internals.setFormValue(v)` | – | warning |
| wc/internals-default-semantics | Set the host's default role and ARIA state through `ElementInternals` (`internals.role`, `internals.ariaChecked`…) instead of sprouting attributes on the host. | Gives semantics without overriding author attributes. | https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals ("Instance properties included from ARIA", `role`); https://web.dev/articles/custom-elements-best-practices | any | static: `this.setAttribute('role'` / `this.setAttribute('aria-` in CE classes | – | – | info |
| wc/custom-states | Expose internal states for styling through `internals.states` and `:state()` instead of reflecting private classes/attributes. | Standard, does not touch author-owned attributes. | MDN Using custom elements ("Custom states and custom state pseudo-class") | autonomous CE | static | – | – | info |
| wc/delegates-focus | Use `delegatesFocus: true` (Lit: `shadowRootOptions`) for hosts wrapping one primary focusable control, and check it does not jump to an element that should not get focus. | Clicking or `.focus()` on the host moves focus inside; the default target is the first focusable element. | https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus; https://lit.dev/docs/components/shadow-dom/ ("Setting shadowRootOptions") | any | static: wrapper of a single `<input>`/`<button>` without delegatesFocus (heuristic) | – | – | info |
| wc/aria-idrefs-same-tree | Keep `id`-based references (`for`, `aria-labelledby`, `aria-describedby`, `aria-controls`) inside one tree (all in the same shadow root, or all in light DOM); slot the label in or label the inner control internally. | IDREFs do not resolve across shadow boundaries; MDN lists a `referenceTarget` option on `attachShadow()` to point outside references at an inner element, but its browser support was not confirmed today. | https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow (`referenceTarget`); boundary behaviour: Not verified on a spec page this pass | any | static: `aria-labelledby`/`for` values whose id is defined in a different tree (needs DOM analysis); runtime: axe inside shadow roots | `<label for="x">` outside → `<my-input>` with internal label or form-associated `labels` | – | warning |
| wc/native-inside | Wrap native interactive elements (`<button>`, `<input>`) inside the shadow root instead of re-creating them with `div` + ARIA. | Keeps keyboard and AT behaviour for free. | general ARIA first rule (see a11y file); MDN Using shadow DOM | any | static: `role="button"` in shadow templates | – | – | warning |

## Security and performance

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| wc/lit-no-unsafe-html-untrusted | Use `unsafeHTML`, `unsafeSVG` and `unsafeStatic` only with developer-controlled strings, never user input or query params. | They parse via innerHTML and open XSS/CSS injection. | https://lit.dev/docs/templates/directives/ (`unsafeHTML`); https://lit.dev/docs/templates/expressions/ (`unsafeStatic`) | Lit | static: grep `unsafeHTML(`/`unsafeSVG(`/`unsafeStatic(` | `unsafeHTML(comment)` → `${comment}` | – | error |
| wc/no-innerhtml-user-data | Do not build shadow-root markup with `innerHTML` from user data in vanilla components; use `textContent` or DOM APIs. | Same XSS risk. | https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM (innerHTML examples); see security file | vanilla CE | static: `shadowRoot.innerHTML = \`…${` | – | – | error |
| wc/lit-single-copy | Ship one copy/version of `lit` core packages and strip dev-mode warnings in production builds. | Lit warns on duplicates; duplicates bloat bundles. | https://lit.dev/docs/tools/development/ | Lit | static: lockfile has more than one `lit-html`/`@lit/reactive-element` version | – | – | warning |

## Official tooling

- Lit recommends ESLint with `eslint-plugin-lit` (2.3.1, MIT) and the `lit-plugin` / `ts-lit-plugin` editor plugins (template type checking) (https://lit.dev/docs/tools/development/). Rule names of `eslint-plugin-lit` not read this pass.
- No W3C/WHATWG linter exists; axe-core and Lighthouse support shadow DOM to a degree (capabilities Not verified here).

## AI-agent resources

- https://lit.dev/llms.txt returned 404 on 2026-11-11; no official Lit MCP server or AI rules found. MDN and web.dev publish none specific to web components.

## Notes for skill authors

- Short skill: valid name, constructor rules, form-associated + ElementInternals, IDREFs stay in one tree, `:host([hidden])`, composed events, `unsafeHTML`. Reference file: lifecycle details, Lit property pitfalls, delegatesFocus caveats.
- The web.dev checklist is from 2017; it predates ElementInternals and custom states. Prefer MDN for current APIs and cite web.dev only for the design checklist.
- Cross-root ARIA (`referenceTarget`) is moving; recheck MDN compat data each run before recommending it.
- Static checks of cross-tree IDREFs are hard; flag as manual unless a DOM is available.

## Not verified

- Browser support and standard status of `referenceTarget` (MDN page for `ShadowRoot.referenceTarget` returned "Page not found"; only the `attachShadow()` option text was read). Search results pointed to a WHATWG DOM pull request (https://github.com/whatwg/dom/pull/1353) — not a primary statement of support.
- The exact spec text stating that IDREFs do not cross shadow boundaries (not located on a spec page in this pass).
- `eslint-plugin-lit` and `eslint-plugin-wc` rule names.
- Angular Elements / Vue `defineCustomElement` detection strings.
- Whether axe-core fully audits inside open/closed shadow roots.
