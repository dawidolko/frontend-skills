# Combobox, listbox and custom select reference

Depth for the `fe-a11y-combobox` skill. Rule ids in brackets: `frontend-skills explain <id>`. Patterns read on the WAI-ARIA Authoring Practices pages on 2026-11-11 (WAI-ARIA 1.2 combobox). Customizable `<select>` (`appearance: base-select`) is not Baseline on that date: Chromium and Safari only.

## Pick the smallest thing that works

| Need | Use |
| --- | --- |
| Pick one of up to ~15 fixed values | `<select>` |
| Free text with optional suggestions | `<input list="id">` + `<datalist>` |
| Pick one of many, with filtering | Combobox with listbox popup |
| Pick one, styled, no typing | Select-only combobox, or `<select>` with `base-select` as enhancement |
| Pick many | Combobox + chips, or a listbox with `aria-multiselectable="true"` |
| Rows with their own actions | Grid pattern, not listbox |

## Editable combobox [a11y/combobox-on-input]

```html
<label for="city">City</label>
<input id="city" type="text" role="combobox" autocomplete="off"
       aria-autocomplete="list" aria-expanded="true" aria-controls="city-list"
       aria-activedescendant="city-opt-2">
<ul id="city-list" role="listbox" aria-label="Cities">
  <li id="city-opt-1" role="option" aria-selected="false">Kraków</li>
  <li id="city-opt-2" role="option" aria-selected="true">Rzeszów</li>
</ul>
<p role="status" class="sr-only">2 results</p>
```

`aria-autocomplete`: `list` (suggestions shown), `both` (and the text completes inline), `none` (the list does not depend on the text).

## Select-only combobox

```html
<span id="size-label">Size</span>
<div role="combobox" tabindex="0" aria-labelledby="size-label"
     aria-expanded="false" aria-controls="size-list" aria-haspopup="listbox">Medium</div>
<ul id="size-list" role="listbox" aria-labelledby="size-label" hidden>…</ul>
```

## Keys [a11y/combobox-keyboard]

| Key | Editable combobox | Select-only |
| --- | --- | --- |
| Down Arrow | Open; move highlight down | Open; move down |
| Up Arrow | Move highlight up | Move up |
| Alt+Down | Open without moving | Open |
| Enter | Accept highlighted, close | Accept, close |
| Escape | Close; if closed, may clear | Close |
| Home, End | Move the text caret | First, last option |
| Printable keys | Type and filter | Jump to the option starting with them |
| Tab | Accept (optional) and move on | Accept and move on |

## Async search

```js
let controller
input.addEventListener('input', debounce(async () => {
  controller?.abort()
  controller = new AbortController()
  const items = await search(input.value, { signal: controller.signal })
  render(items)
  status.textContent = items.length ? `${items.length} results` : 'No results'
}, 300))
```

- Keep the list open and the highlight on a valid option when results change; reset `aria-activedescendant` when the option is gone.
- Show "Loading" text in the list while waiting; never empty the list without saying why.

## Listbox options [a11y/option-no-interactive]

- Options: text, an icon or avatar with `alt=""`, a secondary line; nothing focusable.
- Group options with `role="group"` and `aria-labelledby` on a group label.
- Long or virtual lists: set `aria-setsize` and `aria-posinset` on each rendered option.

## Library notes

| Library | Note |
| --- | --- |
| React Aria `ComboBox`, `Select` | Implements the APG keys and announcements; keep its `Label`. |
| Downshift | Supplies the props; spread `getInputProps`, `getMenuProps`, `getItemProps` on the right elements. |
| Radix `Select` | Select-only; for filtering use a combobox library. |
| Reka UI, bits-ui `Combobox` | Vue and Svelte primitives; keep their label parts. |
| Angular | CDK `Listbox` (`cdkListbox`), and `@angular/aria` once its stability is confirmed. |

## Sources

- APG, Combobox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- APG, Listbox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
- WAI-ARIA 1.2, combobox: https://www.w3.org/TR/wai-aria-1.2/#combobox
- MDN, datalist: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/datalist
- MDN, customizable select elements: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select
- React Aria ComboBox: https://react-spectrum.adobe.com/react-aria/ComboBox.html
