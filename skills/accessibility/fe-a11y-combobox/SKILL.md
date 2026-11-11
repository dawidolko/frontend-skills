---
name: fe-a11y-combobox
description: Builds autocomplete inputs, searchable selects, select-only comboboxes and listboxes that work with keyboard and screen readers (WAI-ARIA APG Combobox and Listbox patterns), after checking whether a native select or datalist is enough. Use when building a typeahead, search suggestions, a custom select, a tag or recipient picker, or when asked "make this dropdown accessible".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Combobox, listbox and custom select
  area: accessibility
  lane: C
  requires: web
  globs: "**/*.html **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro **/*.component.html"
  rules: "a11y/combobox-on-input a11y/popup-button-expanded a11y/option-no-interactive a11y/combobox-keyboard a11y/input-label a11y/status-message-live"
  version: 0.1.0
---

# Combobox, listbox and custom select

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson (for example the project's select component) wins over this skill.

## Rules

- Use a native `<select>` (or `<input list>` with `<datalist>`) unless filtering, rich options or async search are really needed.
- `role="combobox"` goes on the `<input>` itself, not on a wrapper (a11y/combobox-on-input).
- The combobox has `aria-expanded`, `aria-controls` pointing at the listbox, and `aria-autocomplete` (a11y/popup-button-expanded).
- Focus stays in the input; the highlighted option is `aria-activedescendant` with `aria-selected="true"` (a11y/combobox-keyboard).
- Down, Up, Enter, Escape and Alt+Down work as the APG pattern says (a11y/combobox-keyboard).
- Options hold only text and images, never buttons or links (a11y/option-no-interactive).
- The input has a visible `<label>`; a placeholder is not a label (a11y/input-label).
- Announce the result count in a polite live region after typing pauses (a11y/status-message-live).
- Options have unique ids, and the list does not close when the pointer moves over it.

## Do this

1. Try the native element first: `<select>` (styleable with `appearance: base-select` in Chromium as an enhancement only), or `<datalist>` for simple suggestions.
2. Prefer a tested primitive from the project's library (React Aria `ComboBox`, Downshift, Radix `Select`, Reka UI `Combobox`, bits-ui `Combobox`, Angular CDK Listbox) over hand-written code.
3. When writing one: label + input (`role="combobox"`) + `ul role="listbox"` with `li role="option" id`; one state object holds `open`, `activeIndex`, `options`.
4. Debounce async search, cancel stale requests, keep the highlight valid when results change, and announce "5 results" or "No results".
5. For multi-select with chips, keep chip remove buttons outside the listbox and give each a name ("Remove Anna").

## Check

- `npx github:dawidolko/frontend-skills audit --changed` finds wrapper comboboxes, comboboxes without `aria-expanded`, controls inside options and unlabeled inputs.
- By hand: type, arrow through suggestions, accept with Enter, close with Escape; with a screen reader hear the label, "expanded", the highlighted option and the result count.

## References

- [references/combobox.md](references/combobox.md): decision table, full combobox and select-only markup, key tables, async search and live announcements, library notes. Read it when building or reviewing one of these widgets.
