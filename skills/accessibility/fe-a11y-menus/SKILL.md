---
name: fe-a11y-menus
description: Builds site navigation, dropdowns, disclosure menus and menu buttons that work with keyboard and screen readers (WAI-ARIA APG Disclosure and Menu Button patterns) - links in a nav, aria-expanded, aria-current, when role="menu" is right and its keys. Use when building a header, mega menu, hamburger menu, dropdown, account or actions menu, or when asked "make this menu accessible".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Navigation, disclosures and menus
  area: accessibility
  lane: C
  requires: web
  globs: "**/*.html **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro **/*.component.html"
  rules: "a11y/menu-not-for-site-nav a11y/popup-button-expanded a11y/menu-keyboard a11y/state-exposed a11y/link-is-link"
  version: 0.1.0
---

# Navigation, disclosures and menus

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Site navigation is `<nav aria-label>` with a list of `<a href>`, not `role="menu"` or `menubar` (a11y/menu-not-for-site-nav).
- A control with `aria-haspopup`, and every combobox, has `aria-expanded` that follows the open state (a11y/popup-button-expanded).
- A show/hide trigger is a `<button>` with `aria-expanded`, and `aria-controls` for the panel (a11y/state-exposed).
- Navigation items are real links; a sub-list opens from a button, never from a link with `href="#"` (a11y/link-is-link).
- Mark the current page with `aria-current="page"`, not only with a colour.
- A `role="menu"` implements the APG keys: arrows, Home, End, Enter, Escape, type-ahead (a11y/menu-keyboard).
- Escape closes an open menu or panel and focus goes back to its button; a click outside closes it too.
- Never open a submenu on hover alone; hover may open it, but a click and the keyboard must too.

## Do this

1. Decide the pattern: links to pages → disclosure navigation; commands in an app (rename, delete, export) → menu button with `role="menu"`; one choice from a list → `<select>` or a listbox (`fe-a11y-combobox`).
2. For a hamburger on small screens, toggle the same `<nav>` with a `<button aria-expanded aria-controls>`; when it covers the page, render it in a `<dialog>` (`fe-a11y-dialog`).
3. For a menu button, use the project's UI library primitive (Radix `DropdownMenu`, React Aria `Menu`, Reka UI `DropdownMenu`, Angular CDK Menu) or follow the APG example closely.
4. Keep the open state in one variable and bind `aria-expanded`, the `hidden` attribute and the CSS class to it.
5. Use `popover` for the dropdown panel when it should close on outside click and Escape without extra code.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` finds `role="menu"` inside `<nav>`, popup triggers without `aria-expanded`, and fake links.
- By hand: with the keyboard only, open and close every menu, reach every link, press Escape; with a screen reader, hear "expanded" and "collapsed" and "current page".

## References

- [references/menus.md](references/menus.md): disclosure navigation code, menu button code and the full key table, mega menus and hamburger menus, popover for dropdowns. Read it when building a header or an actions menu.
