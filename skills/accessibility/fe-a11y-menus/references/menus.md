# Navigation, disclosures and menus reference

Depth for the `fe-a11y-menus` skill. Rule ids in brackets: `frontend-skills explain <id>`. Patterns read on the WAI-ARIA Authoring Practices pages on 2026-11-11.

## Which pattern

| The items are | Pattern | Roles |
| --- | --- | --- |
| Links to pages of the site | Disclosure navigation | none: `nav`, `ul`, `a`, `button aria-expanded` |
| Show and hide one region (FAQ, filters) | Disclosure | `details`/`summary`, or `button aria-expanded` |
| Commands in an application | Menu button + menu | `button aria-haspopup="menu"`, `menu`, `menuitem` |
| An app-wide command bar (File, Edit, View) | Menubar | `menubar`, `menu`, `menuitem` |
| One value from a list | Select, listbox or combobox | see `fe-a11y-combobox` |

## Disclosure navigation [a11y/menu-not-for-site-nav]

```html
<nav aria-label="Main">
  <ul class="nav">
    <li><a href="/" aria-current="page">Home</a></li>
    <li>
      <button type="button" aria-expanded="false" aria-controls="nav-products">Products</button>
      <ul id="nav-products" hidden>
        <li><a href="/editor">Editor</a></li>
        <li><a href="/sync">Sync</a></li>
      </ul>
    </li>
  </ul>
</nav>
<script type="module">
  for (const button of document.querySelectorAll('.nav button[aria-controls]')) {
    const panel = document.getElementById(button.getAttribute('aria-controls'))
    const set = (open) => { button.setAttribute('aria-expanded', String(open)); panel.hidden = !open }
    button.addEventListener('click', () => set(button.getAttribute('aria-expanded') !== 'true'))
    button.parentElement.addEventListener('keydown', (e) => { if (e.key === 'Escape') { set(false); button.focus() } })
    button.parentElement.addEventListener('focusout', (e) => { if (!button.parentElement.contains(e.relatedTarget)) set(false) })
  }
</script>
```

Keys: Tab moves through buttons and links as usual; Enter or Space toggles; Escape closes. Arrow keys are optional here.

## Menu button [a11y/popup-button-expanded, a11y/menu-keyboard]

```html
<button type="button" id="row-actions-btn" aria-haspopup="menu" aria-expanded="false" aria-controls="row-actions">Actions</button>
<ul id="row-actions" role="menu" aria-labelledby="row-actions-btn" hidden>
  <li role="menuitem" tabindex="-1">Rename</li>
  <li role="menuitem" tabindex="-1">Duplicate</li>
  <li role="menuitem" tabindex="-1">Delete</li>
</ul>
```

| Key | On the button | In the menu |
| --- | --- | --- |
| Enter, Space | Open, focus first item | Activate item, close, focus button |
| Down Arrow | Open, focus first item | Next item (wraps) |
| Up Arrow | Open, focus last item | Previous item (wraps) |
| Home, End | – | First, last item |
| Escape | – | Close, focus button |
| Tab | – | Close, move on |
| A letter | – | Next item starting with it |

Items that change a setting use `menuitemcheckbox` or `menuitemradio` with `aria-checked`.

## Hamburger and mega menus

- Hamburger: `<button aria-expanded aria-controls="site-nav" aria-label="Menu">` toggles the `<nav id="site-nav">`; when the panel covers the page, open it as a modal `<dialog>` so focus stays inside and Escape works.
- Mega menu: a disclosure whose panel holds headings and lists of links; keep headings as real `h2`/`h3`, not `menuitem`.
- Never open only on hover: touch screens and keyboards have no hover; if hover opens it, add a short close delay and keep it open while the pointer is over the panel (WCAG 1.4.13).

## Dropdown panels with popover

```html
<button type="button" popovertarget="account-menu" aria-expanded="false">Account</button>
<div id="account-menu" popover><a href="/settings">Settings</a><a href="/logout">Sign out</a></div>
```

`popover` closes on outside click and Escape and sits in the top layer. Keep `aria-expanded` in sync on the `toggle` event of the popover until browsers' automatic mapping is confirmed for all screen readers.

## Sources

- APG, Disclosure pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- APG, Disclosure Navigation Menu example: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/
- APG, Menu Button pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
- APG, Menu and Menubar pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
- MDN, aria-current: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current
- MDN, popover: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover
