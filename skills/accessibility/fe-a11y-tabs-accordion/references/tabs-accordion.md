# Tabs and accordions reference

Depth for the `fe-a11y-tabs-accordion` skill. Rule ids in brackets: `frontend-skills explain <id>`. Patterns read on the WAI-ARIA Authoring Practices pages on 2026-11-11; `<details name>` is Baseline newly available (2024-09).

## Tabs markup [a11y/tabs-selected]

```html
<div role="tablist" aria-label="Billing period">
  <button role="tab" id="t-month" aria-selected="true" aria-controls="p-month" tabindex="0">Monthly</button>
  <button role="tab" id="t-year" aria-selected="false" aria-controls="p-year" tabindex="-1">Yearly</button>
</div>
<div role="tabpanel" id="p-month" aria-labelledby="t-month" tabindex="0">…</div>
<div role="tabpanel" id="p-year" aria-labelledby="t-year" tabindex="0" hidden>…</div>
```

```js
const tabs = [...document.querySelectorAll('[role="tab"]')]
function select(i, focus = true) {
  tabs.forEach((tab, j) => {
    const on = i === j
    tab.setAttribute('aria-selected', String(on))
    tab.tabIndex = on ? 0 : -1
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !on
  })
  if (focus) tabs[i].focus()
}
tabs.forEach((tab, i) => tab.addEventListener('click', () => select(i)))
tabs[0].parentElement.addEventListener('keydown', (e) => {
  const i = tabs.indexOf(document.activeElement)
  const n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key]
  if (n === undefined) return
  e.preventDefault()
  select((n + tabs.length) % tabs.length)
})
```

## Tab keys [a11y/tabs-keyboard]

| Key | Action |
| --- | --- |
| Tab | Into the tab list (onto the selected tab), then into the panel |
| Left / Right Arrow | Previous / next tab, wrapping (Up / Down with `aria-orientation="vertical"`) |
| Home / End | First / last tab |
| Enter, Space | Select the focused tab (manual activation only) |
| Delete | Remove the tab, if tabs can be closed |

Automatic activation (arrows select) suits panels that render instantly. Manual activation (arrows only move focus) suits panels that load data.

## Accordion [a11y/accordion-header]

Native, one open at a time:

```html
<details name="faq" open><summary>How do I cancel?</summary><p>…</p></details>
<details name="faq"><summary>Can I get an invoice?</summary><p>…</p></details>
```

Custom, when the design needs it:

```html
<h3><button type="button" id="h-ship" aria-expanded="true" aria-controls="p-ship">Shipping</button></h3>
<div id="p-ship" role="region" aria-labelledby="h-ship">…</div>
<h3><button type="button" id="h-ret" aria-expanded="false" aria-controls="p-ret">Returns</button></h3>
<div id="p-ret" role="region" aria-labelledby="h-ret" hidden>…</div>
```

- Heading level fits the page outline (`h2` under the page `h1`, `h3` under an `h2`).
- Enter and Space toggle; arrow keys between headers are optional in the current APG page.
- `role="region"` helps with up to about six panels; with more it adds noise, so leave it out.
- `hidden="until-found"` lets find-in-page open a closed panel; it is not Baseline yet, so treat it as an enhancement.

## Framework notes

| Stack | Note |
| --- | --- |
| React | Keep `selectedIndex` in state; derive `aria-selected`, `tabIndex` and `hidden`; ids from `useId()`. |
| Vue | `:aria-selected="i === selected"` renders `"true"`/`"false"`; ids from `useId()` (3.5+). |
| Svelte | `aria-selected={i === selected}`; the compiler warns about some missing ARIA; keep warnings on. |
| Angular | Bind with `[attr.aria-selected]`; `@angular/cdk/a11y` `FocusKeyManager` handles roving focus. |

## Sources

- APG, Tabs pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- APG, Accordion pattern: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
- MDN, details: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details
- MDN, ARIA tab role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/tab_role
- Angular CDK a11y (FocusKeyManager): https://material.angular.dev/cdk/a11y/overview
