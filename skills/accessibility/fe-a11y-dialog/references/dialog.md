# Dialogs and modals reference

Depth for the `fe-a11y-dialog` skill. Rule ids in brackets: `frontend-skills explain <id>`. Baseline status from web-features, read on 2026-11-11: `<dialog>` and `::backdrop` widely available; `inert` widely available; `popover` newly available (2025-01); invoker commands (`command`, `commandfor`) newly available (2025-12); `closedby` not Baseline.

## Native modal

```html
<button type="button" id="open-delete">Delete project</button>

<dialog id="delete" role="alertdialog" aria-labelledby="delete-title" aria-describedby="delete-desc">
  <h2 id="delete-title">Delete project?</h2>
  <p id="delete-desc">The project and its 12 files are removed for everyone.</p>
  <form method="dialog">
    <button value="cancel" autofocus>Cancel</button>
    <button value="delete">Delete</button>
  </form>
</dialog>

<script type="module">
  const dialog = document.getElementById('delete')
  document.getElementById('open-delete').addEventListener('click', () => dialog.showModal())
  dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'delete') deleteProject()
  })
</script>
```

What `showModal()` gives you: the dialog in the top layer, everything else inert (no focus, no clicks, hidden from screen readers), Escape fires `cancel` and closes it, and focus returns to the previously focused element on close.

## Initial focus [a11y/dialog-focus]

| Dialog content | Focus first |
| --- | --- |
| A form | The first field |
| A destructive confirmation | The safe button (Cancel) |
| Long text the user must read | The heading, with `tabindex="-1"` |
| Only a close button | The close button |

Do not put `tabindex` on the `<dialog>` element itself; use `autofocus` on a child.

## Frameworks

```jsx
// React 19: ref as a prop, the dialog stays mounted
function ConfirmDialog({ open, onClose, title, children }) {
  const ref = useRef(null)
  const titleId = useId()
  useEffect(() => {
    const d = ref.current
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog ref={ref} aria-labelledby={titleId} onClose={onClose}>
      <h2 id={titleId}>{title}</h2>
      {children}
      <button type="button" onClick={onClose}>Close</button>
    </dialog>
  )
}
```

| Stack | Notes |
| --- | --- |
| Vue | `const dialog = useTemplateRef('dialog')`; call `showModal()` in a watcher on the `open` prop; listen to `@close`. |
| Svelte 5 | `bind:this={dialog}`, `$effect(() => open ? dialog.showModal() : dialog.close())`, `onclose={…}`. |
| Angular | CDK `Dialog` (`@angular/cdk/dialog`) traps and restores focus and sets `aria-labelledby`; or a native `<dialog>` with `viewChild`. |
| Libraries | Radix `Dialog`, React Aria `Modal`, Reka UI `Dialog`, bits-ui `Dialog`: keep their `Title` part, it is the name. |

## Dialog, popover or disclosure

| Need | Use |
| --- | --- |
| Blocks the page until answered | `<dialog>` + `showModal()` |
| Panel the user may ignore, page stays usable | `<dialog>` + `show()`, or `popover` |
| Menu, listbox or toggletip next to a trigger | `popover` (light dismiss, top layer, no focus trap) |
| Content that expands in place | `<details>` |

`popover` is not modal: it does not trap focus or make the page inert. Do not use it for confirmations.

## Old patterns to replace

| Old | Problem | Now |
| --- | --- | --- |
| `div role="dialog"` + focus-trap library + `aria-hidden` on siblings | many moving parts, siblings often keep focusable content | `<dialog>` + `showModal()` [a11y/dialog-native] |
| `aria-hidden="true"` on `#app` while the modal is open | breaks if the modal is inside `#app`; focusable content stays reachable | `inert` on the background, or `showModal()` [a11y/aria-hidden-focusable] |
| Closing only via an "×" icon without a name | unnamed control | `<button aria-label="Close">` or visible text |
| Modal opened on page load | traps people before they see the page | open from a user action |

## Scroll lock

```css
body:has(dialog[open]:modal) { overflow: hidden; }
dialog::backdrop { background: rgb(0 0 0 / 0.5); }
```

## Sources

- APG, Dialog (Modal): https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- APG, Alert and Message Dialogs: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
- HTML Standard, the dialog element: https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element
- MDN, dialog: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
- MDN, popover: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover
- Angular CDK Dialog: https://material.angular.dev/cdk/dialog/overview
