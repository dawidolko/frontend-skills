---
name: fe-a11y-tabs-accordion
description: Builds tabs, accordions and FAQ sections with the right roles, states and keyboard model (WAI-ARIA APG Tabs and Accordion patterns), preferring details and summary where they fit. Use when building tabs, segmented views, an accordion, collapsible sections or an FAQ in any stack, or when asked "should this be tabs or an accordion".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Tabs and accordions
  area: accessibility
  lane: C
  requires: web
  globs: "**/*.html **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro **/*.component.html"
  rules: "a11y/tabs-selected a11y/tabs-keyboard a11y/accordion-header a11y/state-exposed a11y/no-click-on-static"
  version: 0.1.0
---

# Tabs and accordions

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Tabs use `tablist` > `tab`, each tab with `aria-selected` and `aria-controls`, each panel `tabpanel` with `aria-labelledby` (a11y/tabs-selected).
- A tab list is one Tab stop: roving `tabindex`, arrow keys, Home and End (a11y/tabs-keyboard).
- Accordion headers are `<button aria-expanded>` inside a heading, or `<summary>` in `<details>` (a11y/accordion-header).
- Open and closed state is exposed, never only a CSS class (a11y/state-exposed).
- Headers and tabs are buttons, never clickable `div`s (a11y/no-click-on-static).
- Give a `tabpanel` `tabindex="0"` when its first content is not focusable.
- Use `<details name="group">` for a one-open-at-a-time accordion before writing script.
- Tabs that change the URL or load a page are links in a `<nav>`, not tabs.

## Do this

1. Choose: few short panels on wide screens → tabs; many or long sections, or small screens → accordion; navigation between pages → links with `aria-current="page"`.
2. Use the UI library's primitive if the project has one (Radix `Tabs`, React Aria `Tabs`, Reka UI `Tabs`, Angular CDK or `@angular/aria` once stable); check that it renders the roles below.
3. Otherwise build tabs from buttons with `role="tab"`; keep the selected index in one state and derive `aria-selected`, `tabindex` and the visible panel from it.
4. Hide inactive panels with `hidden` (not only `opacity`), so they leave the Tab order and the accessibility tree.
5. For an FAQ, start with `<details>`/`<summary>`; style the marker with `summary::marker` or `list-style: none`.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` finds tabs without `aria-selected` and clickable `div` headers.
- `audit --url <page>` adds axe-core's required parent and child role checks (a `tab` outside a `tablist`).
- By hand: Tab reaches the tab list once, arrows move, Tab enters the panel; accordion headers toggle with Enter and Space and announce expanded or collapsed.

## References

- [references/tabs-accordion.md](references/tabs-accordion.md): complete tabs markup and script, key tables, automatic versus manual activation, accordion with details and with buttons, framework notes. Read it when building one of these widgets.
