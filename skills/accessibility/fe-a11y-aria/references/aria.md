# ARIA, names and live regions reference

Depth for the `fe-a11y-aria` skill. Rule ids in brackets: `frontend-skills explain <id>`. Status read on 2026-11-11: WAI-ARIA 1.2 is the Recommendation; 1.3 is a Working Draft (treat its additions, such as `ariaNotify()`, as progressive enhancement); ARIA in HTML is the normative table of which role and attribute each element allows.

## Native first [a11y/prefer-native-element]

| Need | Native element | Baseline |
| --- | --- | --- |
| Action | `<button type="button">` | widely |
| Navigation | `<a href>` | widely |
| On/off | `<input type="checkbox">`, plus `role="switch"` if it is a switch | widely |
| Show/hide | `<details><summary>`; one open at a time with `<details name="x">` | widely; `name` newly |
| Modal | `<dialog>` + `showModal()` | widely |
| Popup next to a trigger | `popover` attribute | newly (2025-01) |
| Value in range / progress | `<meter>`, `<progress>` | widely |
| Search area | `<search>` | widely |
| Remove from focus and AT | `inert` | widely |

## Accessible name order [a11y/control-name]

1. `aria-labelledby` (may point at hidden text, which still counts)
2. `aria-label`
3. The host language: `<label>`, `alt`, `<caption>`, `<legend>`, SVG `<title>`
4. Content, for roles that take their name from content (button, link, heading, tab, option, menuitem)
5. `title` last, and not reliable: it is not shown on touch or to keyboard users

`placeholder` is not part of the name computation in AccName 1.2.

Visually hidden text that stays readable:

```css
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0;
}
```

## Hiding things

| Goal | Use |
| --- | --- |
| Hidden for everyone | `hidden`, `display: none` |
| Visible, not focusable or clickable (background of a modal, off-screen drawer) | `inert` |
| Decoration only, nothing focusable inside | `aria-hidden="true"` [a11y/aria-hidden-focusable] |
| Read by screen readers only | `.sr-only` |

## States per widget [a11y/state-exposed]

| Widget | Attribute | Values |
| --- | --- | --- |
| Disclosure, menu button, combobox | `aria-expanded` | `true` / `false` |
| Toggle button (label stays the same) | `aria-pressed` | `true` / `false` |
| Switch, checkbox-like role | `aria-checked` | `true` / `false` (`mixed` for checkboxes only) |
| Tab, option, gridcell | `aria-selected` | `true` / `false` |
| Current page or step | `aria-current` | `page`, `step`, `date`, `true` |
| Invalid field | `aria-invalid` | `true` |
| Busy region | `aria-busy` | `true` while loading |
| Unavailable but discoverable | `aria-disabled="true"` and block the action | instead of `disabled` when it must stay focusable |

Never mirror a native state: no `aria-checked` on `<input type="checkbox">`, no `aria-disabled` next to `disabled`.

## Live regions [a11y/status-message-live]

| Message | Use |
| --- | --- |
| Saved, added, 12 results, loading finished | `role="status"` (polite) |
| Payment failed, session about to end | `role="alert"` (assertive), sparingly |
| Chat, log of events | `role="log"` |
| Time left | `role="timer"` (announces nothing by default) |

Rules that make them work:

- The region is in the DOM before its text changes (render it empty in the layout).
- Change its text; do not replace the element.
- One message at a time; do not announce every keystroke of a search box (debounce, then announce the count).
- Never move focus to an alert; if the user must answer, use an alert dialog.

| Stack | Ready-made announcer |
| --- | --- |
| Angular | CDK `LiveAnnouncer.announce(text)` |
| Nuxt | `<NuxtAnnouncer>` and `useAnnouncer()` (Nuxt 4.4 and newer, per the Nuxt docs) |
| React, Vue, Svelte | A small shared component that renders `<div role="status">` once and exposes `announce(text)` |

## What automated checks see

axe-core (used by `audit --url` and Lighthouse) checks names, valid roles and attributes, required children and parents, and `aria-hidden` over focusables. It cannot tell whether a name is meaningful, whether a state changes at the right moment, or whether a live region was announced: listen with a screen reader for those.

## Sources

- WAI-ARIA 1.2: https://www.w3.org/TR/wai-aria-1.2/
- ARIA in HTML: https://www.w3.org/TR/html-aria/
- AccName 1.2: https://www.w3.org/TR/accname-1.2/
- APG, Read Me First: https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/
- WCAG 2.2 Understanding 4.1.2 and 4.1.3: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html, https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- MDN, ARIA live regions: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions
- Angular CDK a11y: https://material.angular.dev/cdk/a11y/overview
