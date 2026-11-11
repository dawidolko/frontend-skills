# Building a component reference

Depth for the `fe-component` skill. Rule ids in brackets: `frontend-skills explain <id>`. Patterns from the WAI-ARIA Authoring Practices Guide, read on 2026-11-11.

## Checklist

| Step | Done when |
| --- | --- |
| Reuse | No existing component or library primitive fits |
| Semantics | Native element, or the APG pattern's roles [a11y/prefer-native-element] |
| Name | Visible label or `aria-label` on every control [a11y/control-name] |
| Keyboard | APG keys work; one Tab stop for composites; Escape closes popups |
| State | `aria-expanded`/`pressed`/`selected`/`checked`/`invalid`/`busy` bound to state [a11y/state-exposed] |
| Focus | `:focus-visible` style; focus moves into and back out of popups [a11y/focus-visible] |
| Visual states | Hover, active, disabled, invalid, loading, empty, long content |
| Layout | Works at 320px and 200% text; no fixed heights on text |
| Motion | Respects `prefers-reduced-motion` |
| Tokens | Colours, spacing, radii, sizes and icons from the project's helpers |
| API | Passes `id`, class and ARIA props; ref to the focusable element |
| Tests | By role and name; keyboard path; axe check [test/query-by-role] |

## Pattern map

| The component | Native first | Otherwise (APG) |
| --- | --- | --- |
| Button, toggle | `<button type="button">`, `aria-pressed` | Button pattern |
| Link | `<a href>` | Link pattern |
| Show/hide, FAQ | `<details>`/`<summary>` | Disclosure, Accordion |
| Modal, drawer | `<dialog>` + `showModal()` | Dialog (Modal) |
| Popup next to a trigger | `popover` | Menu Button, Disclosure |
| Select | `<select>` | Combobox, Listbox |
| Tabs | – | Tabs |
| Slider | `<input type="range">` | Slider |
| Switch | `<input type="checkbox" role="switch">` | Switch |
| Progress, meter | `<progress>`, `<meter>` | – |
| Table | `<table>` with `<th scope>` | Grid only for editing |
| Toast | One `role="status"` region | Alert |

## API conventions

- Content as children or slots; a `label` prop only when there is no visible text.
- Controlled and uncontrolled: `open` with `onOpenChange`, `value` with `onValueChange`, plus `default…` props.
- Ids: `useId()` (React, Vue 3.5), `$props.id()` (Svelte 5), an injected counter in Angular.
- Do not swallow props: spread the rest onto the root or the focusable element, as the library convention says.

## Example: icon button

```jsx
// React 19: ref is a normal prop
export function IconButton({ label, icon: Icon, ref, ...props }) {
  return (
    <button type="button" aria-label={label} ref={ref} className="icon-button" {...props}>
      <Icon aria-hidden="true" focusable="false" />
    </button>
  )
}
```

```vue
<!-- Vue 3.5 -->
<script setup>
defineProps({ label: { type: String, required: true } })
</script>
<template>
  <button type="button" class="icon-button" :aria-label="label"><slot name="icon" /></button>
</template>
```

```css
.icon-button { min-width: 24px; min-height: 24px; padding: 0.25rem; display: inline-grid; place-items: center; }
.icon-button:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
@media (pointer: coarse) { .icon-button { min-width: 44px; min-height: 44px; } }
```

## Example: disclosure

```svelte
<!-- Svelte 5 -->
<script>
  let { title, children } = $props()
  let open = $state(false)
  const id = $props.id()
</script>
<button type="button" aria-expanded={open} aria-controls="{id}-panel" onclick={() => (open = !open)}>{title}</button>
<div id="{id}-panel" hidden={!open}>{@render children()}</div>
```

## Test template

```js
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('opens and closes with the keyboard', async () => {
  const user = userEvent.setup()
  render(<Disclosure title="Shipping">Free over 100 zł</Disclosure>)
  const button = screen.getByRole('button', { name: 'Shipping' })
  expect(button).toHaveAttribute('aria-expanded', 'false')
  await user.tab()
  await user.keyboard('{Enter}')
  expect(button).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByText('Free over 100 zł')).toBeVisible()
})
```

## Sources

- APG, Patterns: https://www.w3.org/WAI/ARIA/apg/patterns/
- APG, Read Me First: https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/
- React, useId: https://react.dev/reference/react/useId
- Vue, useId: https://vuejs.org/api/composition-api-helpers.html#useid
- Svelte, $props.id(): https://svelte.dev/docs/svelte/$props#$props.id()
- Testing Library, queries: https://testing-library.com/docs/queries/about/
