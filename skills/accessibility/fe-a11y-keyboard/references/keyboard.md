# Keyboard access and focus reference

Depth for the `fe-a11y-keyboard` skill. Rule ids in brackets: `frontend-skills explain <id>`. Patterns checked on the WAI-ARIA Authoring Practices pages on 2026-11-11.

## Keys people expect

| Control | Keys | Native element that does it |
| --- | --- | --- |
| Link | Enter | `<a href>` |
| Button | Enter, Space | `<button>` |
| Checkbox | Space | `<input type="checkbox">` |
| Radio group | Arrow keys move and select; one Tab stop | `<input type="radio">` with the same `name` |
| Select | Arrows, type-ahead, Enter, Escape | `<select>` |
| Disclosure | Enter, Space | `<details><summary>` |
| Modal dialog | Tab cycles inside, Escape closes | `<dialog>` + `showModal()` |
| Tabs, menu, listbox, tree, grid | One Tab stop, arrows inside, Home and End | none; follow the APG pattern |

A custom control that copies a native one must copy all of its keys; that is why a native element is almost always cheaper.

## Focus order [a11y/positive-tabindex]

- Tab order is DOM order. Values: no `tabindex` on native controls; `tabindex="0"` to add a custom widget; `tabindex="-1"` for targets you focus from script (headings after navigation, an error summary, a dialog heading).
- CSS that reorders (`order`, `flex-direction: row-reverse`, grid placement, absolute positioning) does not change the Tab order, so the focus jumps around the screen. Change the DOM instead (WCAG 1.3.2, 2.4.3).
- New content goes right after its trigger in the DOM, or focus moves into it.

## Roving tabindex

```js
// One Tab stop for a group: the current item has tabindex 0, the rest -1.
function move(items, from, to) {
  items[from].tabIndex = -1
  items[to].tabIndex = 0
  items[to].focus()
}
list.addEventListener('keydown', (e) => {
  const items = [...list.querySelectorAll('[role="option"]')]
  const i = items.indexOf(document.activeElement)
  if (e.key === 'ArrowDown') move(items, i, Math.min(i + 1, items.length - 1))
  if (e.key === 'ArrowUp') move(items, i, Math.max(i - 1, 0))
  if (e.key === 'Home') move(items, i, 0)
  if (e.key === 'End') move(items, i, items.length - 1)
})
```

The alternative is `aria-activedescendant` on the focused container (used by comboboxes, where focus must stay in the input).

## Visible focus [a11y/focus-visible]

```css
:focus-visible { outline: 2px solid var(--focus-ring, #1a56db); outline-offset: 2px; }
/* only when the design insists: hide the ring for mouse clicks, keep it for keyboard */
:focus:not(:focus-visible) { outline: none; }
```

- The ring needs 3:1 contrast against the colours around it (WCAG 1.4.11); on mixed backgrounds use two rings (`outline` plus a contrasting `box-shadow`).
- `:focus-visible` is Baseline widely available. Tailwind: `focus-visible:outline-2 focus-visible:outline-offset-2`.

## Not obscured [a11y/focus-not-obscured]

```css
:root { --header-h: 4rem; --footer-h: 0rem; }
html { scroll-padding-block: calc(var(--header-h) + 0.5rem) calc(var(--footer-h) + 0.5rem); }
```

Cookie banners and chat launchers: let people dismiss them, place them so they do not cover the main content, or make them modal while they demand a choice.

## Skip link [a11y/skip-link]

```html
<a class="skip-link" href="#main">Skip to main content</a>
…
<main id="main" tabindex="-1">…</main>
```

```css
.skip-link { position: absolute; left: 0.5rem; top: -3rem; }
.skip-link:focus { top: 0.5rem; }
```

## Route changes in single-page apps [a11y/focus-route-change]

| Stack | Announcement | Focus |
| --- | --- | --- |
| Next.js (App Router) | Built-in route announcer reads the new title or `h1`. | Focus `h1` in a client component on pathname change if the design needs it. |
| Nuxt | `<NuxtRouteAnnouncer>` in `app.vue`. | `router.afterEach` then focus the `h1`. |
| SvelteKit | Built-in announcement and focus reset to `<body>` after navigation. | `afterNavigate` to focus a heading. |
| Angular | No built-in announcer; use CDK `LiveAnnouncer`. | Focus the `h1` on `NavigationEnd`. |
| React Router, Vue Router | None built in. | Focus the `h1` in a layout effect after the location changes. |

## Pointer and drag (WCAG 2.5.2, 2.5.7)

- Activate on `click` (the up event). `mousedown` and `pointerdown` actions cannot be aborted by moving away.
- Every drag (sortable list, slider, splitter, kanban) also works with clicks: "Move up" and "Move down" buttons, or arrow keys on a focused handle.

## Manual test script (5 minutes)

1. Reload, press Tab: the first stop is the skip link and it is visible.
2. Tab through the page: every control is reachable, in reading order, with a visible ring, never hidden under a sticky bar.
3. Activate each control with Enter or Space; open menus and dialogs; Escape closes them and focus returns to the trigger.
4. Shift+Tab back to the start: no trap anywhere.
5. In an SPA, follow a link: focus lands on the new page's heading.

## Sources

- WCAG 2.2 Understanding 2.1.1, 2.1.2, 2.4.1, 2.4.3, 2.4.7, 2.4.11: https://www.w3.org/WAI/WCAG22/Understanding/
- APG, Developing a Keyboard Interface: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
- MDN, `:focus-visible`: https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible
- MDN, `scroll-padding`: https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding
- Next.js accessibility: https://nextjs.org/docs/architecture/accessibility
- SvelteKit accessibility: https://svelte.dev/docs/kit/accessibility
- Angular CDK a11y: https://material.angular.dev/cdk/a11y/overview
