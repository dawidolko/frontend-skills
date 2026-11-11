# Accessibility patterns, focus and light libraries: sources and candidate rules

Read on 2026-11-11. WCAG success-criterion mapping lives in `accessibility.md`; this file only cites SC numbers where a
pattern rule needs them. Nothing here makes a page "conformant": automated checks find only part of the problems, and
most pattern rules (keyboard model, focus placement, announcements) need a person with a keyboard and a screen reader.

Primary sources:

- WAI-ARIA Authoring Practices Guide (APG), patterns index: https://www.w3.org/WAI/ARIA/apg/patterns/ (30 patterns;
  page carries no revision date)
- APG, Developing a Keyboard Interface: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
- WAI-ARIA 1.2, W3C Recommendation 6 June 2023: https://www.w3.org/TR/wai-aria-1.2/
- WAI-ARIA 1.3, W3C Working Draft 4 June 2026: https://www.w3.org/TR/wai-aria-1.3/
- ARIA in HTML, W3C Recommendation 11 August 2026: https://www.w3.org/TR/html-aria/
- Using ARIA, W3C *Discontinued Draft* 24 February 2026: https://www.w3.org/TR/using-aria/
- Accessible Name and Description Computation 1.2, W3C Working Draft 4 November 2026: https://www.w3.org/TR/accname-1.2/
- WCAG 2.2 (SC numbers only; mapping is in `accessibility.md`): https://www.w3.org/TR/WCAG22/
- HTML Living Standard, dialog https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element and popover https://html.spec.whatwg.org/multipage/popover.html
- axe-core 4.14.0 rule ids: read from the published package `axe.min.js` (https://registry.npmjs.org/axe-core/-/axe-core-4.14.0.tgz)
- WCAG 2.2 Understanding docs: 2.4.11 https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html ,
  4.1.3 https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- Baseline status: `web-features@3.45.0` `data.json` (Apache-2.0), downloaded from https://registry.npmjs.org/web-features
  (the dataset behind Baseline / webstatus.dev). "Widely" = `baseline: high`, "Newly" = `baseline: low`.
- Framework docs: SvelteKit https://svelte.dev/docs/kit/accessibility , Svelte compiler warnings
  https://svelte.dev/docs/svelte/compiler-warnings , Next.js https://nextjs.org/docs/architecture/accessibility ,
  Nuxt https://nuxt.com/docs/4.x/api/components/nuxt-route-announcer and
  https://nuxt.com/docs/4.x/api/components/nuxt-announcer , Angular https://angular.dev/best-practices/a11y and
  https://angular.dev/guide/aria/overview , Storybook https://storybook.js.org/docs/writing-tests/accessibility-testing
- Package data: npm registry JSON (https://registry.npmjs.org/<name>) for version, `license`, publish date, deprecation;
  bundlephobia API (https://bundlephobia.com/api/size?package=<name>) for min and min+gzip of the whole entry point.

## Status facts a rule writer needs (read 2026-11-11)

| item | status today | source |
|---|---|---|
| WAI-ARIA | 1.2 is the current Recommendation (2023-06-06). 1.3 is a Working Draft (2026-06-04); its listed additions include `sectionheader`/`sectionfooter` roles, an `ariaNotify` API, and a ban on `aria-hidden="true"` on the root element. Write rules against 1.2; treat 1.3 items as "info". | https://www.w3.org/TR/wai-aria-1.2/ , https://www.w3.org/TR/wai-aria-1.3/ |
| ARIA in HTML | Recommendation dated 2026-08-11; normative source for "which role/aria-* is allowed on which element". | https://www.w3.org/TR/html-aria/ |
| Using ARIA | Now a Discontinued Draft (2026-02-24) that points readers to the APG. It lists **four** rules (native first; don't change native semantics needlessly; ARIA widgets must be keyboard-operable; no `presentation`/`aria-hidden` on focusable elements). Cite it as background only; cite html-aria / APG for rules. The "every interactive element needs an accessible name" idea belongs under WCAG 4.1.2 instead. | https://www.w3.org/TR/using-aria/ |
| AccName | 1.2 Working Draft (2026-11-04). Order: `aria-labelledby` → `aria-label` → host-language label (`<label>`, `alt`, `<caption>`, SVG `<title>`) → name from content (only for roles that allow it) → tooltip attribute (`title`) last. `aria-labelledby` may point at hidden content and that content still counts. `placeholder` is not in the algorithm. Description order: `aria-describedby` → `aria-description` → host language → `title`. | https://www.w3.org/TR/accname-1.2/ §4.3 |
| APG tooltip | Page still marked "work in progress", no task-force consensus. | https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/ |
| APG toast | No APG pattern exists for toast/snackbar/notification (not in the 30-pattern index). Rules for it come from the Alert pattern + WCAG 4.1.3 + 2.2.1/2.2.3. | https://www.w3.org/WAI/ARIA/apg/patterns/ |

### Native HTML alternatives and Baseline (web-features 3.45.0, read 2026-11-11)

| feature | Baseline | dates (newly / widely) | use it for |
|---|---|---|---|
| `<dialog>` (+ `showModal()`) | Widely | 2022-03-14 / 2024-09-14 | modal and non-modal dialogs, alert dialogs |
| `::backdrop` | Widely | 2022-03-14 / 2024-09-14 | modal scrim |
| `:modal` | Widely | 2022-09-02 / 2025-03-02 | styling open modal |
| `dialog.requestClose()` | Newly | 2025-05-27 / – | close with cancel event |
| `<dialog closedby>` | Not Baseline (no Safari) | – | light-dismiss control; progressive enhancement only |
| `inert` | Widely | 2023-04-11 / 2025-10-11 | removing background from focus + a11y tree |
| `popover` attribute | Newly | 2025-01-27 / – (widely expected ~2027-07) | menus, listbox popups, toggletips, non-modal overlays |
| `popover="hint"` | Not Baseline (no Safari) | – | hover hints; enhancement only |
| Interest invokers (`interestfor`) | Not Baseline (Chromium only) | – | hover/focus tooltips; do not rely on |
| Invoker commands (`command`/`commandfor`) | Newly | 2025-12-12 / – | declarative open/close of dialog/popover |
| `<details>`/`<summary>` | Widely | 2020-01-15 / 2022-07-15 | disclosure |
| `<details name>` (exclusive group) | Newly | 2024-09-03 / – | single-open accordion |
| `::details-content` | Newly | 2025-09-16 / – | animating disclosure body |
| `:open` | Newly | 2026-05-11 / – | styling open details/dialog/select |
| `hidden="until-found"` | Not Baseline (no Safari) | – | find-in-page into collapsed panels; enhancement |
| `<search>` | Widely | 2023-10-13 / 2026-04-13 | search landmark without `role=search` |
| Customizable `<select>` (`appearance: base-select`) | Not Baseline (Chromium 135, Safari 27; no Firefox) | – | styled select; must degrade to normal `<select>` |
| `<input type=checkbox switch>` | Not Baseline (Safari only) | – | switch; use `role="switch"` on a checkbox instead |
| `:focus-visible` | Widely | 2022-03-14 / 2024-09-14 | keyboard focus ring |
| `:focus-within` | Widely | 2020-01-15 / 2022-07-15 | composite focus styling |
| `focusgroup` | Not Baseline (Chromium 150 only) | – | future native arrow-key roving; not yet |
| `reading-flow` | Not Baseline (Chromium only) | – | visual vs DOM order; not yet |
| ARIA attribute reflection (`el.ariaExpanded`) | Widely | 2023-10-24 / 2026-04-24 | setting ARIA from JS |
| `ariaNotify()` | Newly | 2026-09-14 / – | announcements without a live region (WCAG technique ARIA27) |
| `<meter>` / `<progress>` / `<output>` | Widely | – | meter, progressbar, status output |
| `scrollIntoView()` | Widely | – | keeping focused item visible |

Source for every row: `web-features@3.45.0` data.json, feature ids `dialog`, `backdrop`, `modal`, `requestclose`,
`dialog-closedby`, `inert`, `popover`, `popover-hint`, `interest-invokers`, `invoker-commands`, `details`,
`details-name`, `details-content`, `open-pseudo`, `hidden-until-found`, `search`, `customizable-select`,
`switch-control`, `focus-visible`, `focus-within`, `focusgroup`, `reading-flow`, `aria-attribute-reflection`,
`arianotify`, `meter`, `progress`, `output`, `scroll-into-view`.

## Component patterns (APG)

Column `sev` = suggested severity. Unless noted, the source is the APG page for that pattern
(`https://www.w3.org/WAI/ARIA/apg/patterns/<slug>/`, slug in brackets). "Native first" rows come from html-aria and the
Baseline table above. Static checks can only find the markup half; the keyboard model always needs a runtime or manual
check.

### Dialog (modal) [dialog-modal], alert dialog [alertdialog]

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| a11y/dialog-native | Build modals on `<dialog>` opened with `showModal()` so the browser gives top layer, background inertness, Escape handling and focus return. | Hand-made traps get focus, inertness and Escape wrong; native is Baseline widely since 2024-09. | HTML spec, dialog element https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element ; web-features `dialog` | any | static: `role="dialog"` on `<div>` with no `<dialog>` in the component → info suggestion | `<div role=dialog>` + JS trap → `<dialog>` + `showModal()` | none needed; `a11y-dialog` only for legacy | warning |
| a11y/dialog-name | Give every dialog an accessible name from its visible heading (`aria-labelledby`) or `aria-label`. | Screen readers announce the name on open; unnamed dialogs are announced as just "dialog". | APG dialog-modal, Roles States Properties; axe `aria-dialog-name` | any | static: `<dialog>`/`role=dialog/alertdialog` without `aria-labelledby`/`aria-label`; runtime: axe `aria-dialog-name` | `<dialog>` → `<dialog aria-labelledby="t"><h2 id="t">` | – | error |
| a11y/dialog-modal-true-only-if-modal | Mark a custom dialog `aria-modal="true"` only when the page outside really is blocked and visually covered. | `aria-modal` hides outside content from some AT; a false claim strands those users. | APG dialog-modal, notes on aria-modal | any | manual (does outside content stay operable?) | non-blocking panel with `aria-modal=true` → drop it or make it truly modal | – | warning |
| a11y/dialog-initial-focus | On open, put focus on the first focusable element, or on a `tabindex=-1` heading/first paragraph when content is long, or on the least destructive button for irreversible actions. | Users must land inside the dialog in a place that does not trigger a destructive action by accident. | APG dialog-modal, keyboard notes; HTML spec dialog focusing steps (uses `autofocus` descendant, else focus delegate, else the dialog) | any | runtime: Playwright `toBeFocused` after open; manual | focus left on trigger → `autofocus` on the right control inside `<dialog>` | – | error |
| a11y/dialog-no-tabindex | Do not put `tabindex` on a `<dialog>` element; use `autofocus` on a child (or on the dialog itself if nothing inside is interactive). | The HTML spec forbids it and it changes the focusing steps. | HTML spec, dialog element, author requirements | HTML | static: `<dialog` with `tabindex` | `<dialog tabindex=-1>` → `<dialog>` + `autofocus` on child | – | warning |
| a11y/dialog-focus-contained | While a modal is open, Tab and Shift+Tab must cycle only through the dialog's controls. | Focus escaping behind a modal loses keyboard and screen-reader users. | APG dialog-modal keyboard; WCAG 2.4.3 | any | runtime: tab through N+1 times, assert focus stays inside; manual | custom div modal without trap → `showModal()` (browser makes the rest inert) or `inert` on siblings | `focus-trap@8.2.4` for non-native cases | error |
| a11y/dialog-escape | Escape closes the dialog (alert dialogs may require an explicit choice, but Escape should still cancel when safe). | Standard dismissal key; absence can feel like a trap. | APG dialog-modal keyboard; HTML close requests | any | runtime: press Escape, assert closed | `keydown` handler missing → native `<dialog>` cancel event | – | error |
| a11y/dialog-return-focus | On close, send focus back to the control that opened it, or to the logical next place if that control is gone. | Focus dropping to `<body>` makes keyboard users start over from the top. | APG dialog-modal; APG button "focus after activation"; HTML spec (native modal restores previously focused element) | any | runtime: assert trigger focused after close | `dialog.close()` after removing trigger → focus a sensible heading/row | – | error |
| a11y/dialog-visible-close | Include a visible close or cancel button inside the tab sequence. | Pointer, touch and switch users need a way out other than Escape. | APG dialog-modal notes | any | static (weak): dialog without a `<button>` child; manual | icon-less "×" with no name → `<button aria-label="Close">` | – | warning |
| a11y/alertdialog-role-describedby | Use `role="alertdialog"` for interrupting confirmations/errors and point `aria-describedby` at the message. | AT may play a system sound and reads the message with the name. | APG alertdialog | any | static: `role=alertdialog` without `aria-describedby` | `role=dialog` for "Delete file?" → `role=alertdialog aria-describedby=msg` (works on `<dialog>`) | – | warning |
| a11y/dialog-no-aria-hidden-ancestor | When the legacy `aria-hidden` approach is used, never place the dialog inside an `aria-hidden="true"` subtree. | The dialog itself would vanish from the accessibility tree. | APG dialog-modal notes | any | static: `aria-hidden` ancestor of dialog in same template; runtime axe | portal into `aria-hidden` root → portal to `<body>` or use `inert` on siblings | – | error |

### Alert, live regions, toast (no APG pattern for toast)

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| a11y/alert-dynamic-only | Insert `role="alert"` content dynamically; content already present at load is not reliably announced. | Screen readers announce changes, not initial content. | APG alert | any | runtime/manual | server-rendered `<div role=alert>Saved</div>` → render the text into an existing empty live region after the event | – | warning |
| a11y/alert-no-focus-move | Never move focus to an alert; if the user must respond, use an alert dialog. | Moving focus interrupts the task and changes context. | APG alert | any | static: `.focus()` call on element with `role=alert` | `alertEl.focus()` → no focus call | – | warning |
| a11y/alert-not-for-everything | Reserve `role="alert"` / `aria-live="assertive"` for important, time-sensitive messages; use `role="status"` (polite) for results like "Saved". | Over-use interrupts users; listed as a failure in 4.1.3 Understanding. | WCAG 2.2 Understanding 4.1.3 (failures; ARIA22 vs ARIA19) | any | static: count `role=alert`/`aria-live=assertive`; manual review of the text | "3 results" in `role=alert` → `role=status` | – | warning |
| a11y/live-region-present-first | Render the live-region container on load (empty) and change its text later; do not mount the container and its text in the same tick. | Many AT only watch regions that already exist. | WCAG technique ARIA19/ARIA22 via 4.1.3 Understanding; APG alert (page-load note) | any | manual / runtime | `{show && <div role=status>Saved</div>}` → `<div role=status>{msg}</div>` always mounted | framework announcer: Nuxt `<NuxtAnnouncer>` (≥4.4.2), Angular CDK `LiveAnnouncer` | warning |
| a11y/status-message-programmatic | Every status message (result, progress, waiting, error summary without focus move) must be exposed through `status`, `alert`, `log`, `progressbar` or `ariaNotify()`. | WCAG 4.1.3 (AA); failure F103. | https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html | any | manual (static can only find toast components without a role) | toast `<div class=toast>` → inside a persistent `role=status` region | `ariaNotify()` is Baseline newly (2026-09-14): enhancement with live-region fallback | error |
| a11y/toast-no-auto-dismiss-critical | Do not auto-hide toasts that carry needed information or actions; if they time out, give enough time or a way to pause/extend, and keep the information reachable elsewhere. | APG alert warns auto-disappearing alerts can fail 2.2.3; WCAG 2.2.1 timing applies to content with actions. | APG alert; WCAG 2.2.1 / 2.2.3 (see accessibility.md) | any | static: toast with `setTimeout` dismiss and a button inside; manual | 3 s toast with "Undo" → persistent until dismissed, or longer + pause on hover/focus | – | warning |
| a11y/toast-actions-reachable | If a toast has a button, provide a keyboard route to it (shortcut or landmark) and never steal focus to it. | A polite announcement does not move focus, so the action is otherwise unreachable before it vanishes. | Derived from APG alert + 4.1.3 (no APG toast pattern exists; mark as project convention) | any | manual | "Undo" only in a 4 s toast → also offer undo in the page or keep toast open | – | info |

### Disclosure [disclosure], accordion [accordion]

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| a11y/disclosure-native | Prefer `<details>/<summary>` for show/hide; use `<details name="x">` for single-open accordions (Baseline newly 2024-09). | Built-in expanded state, keyboard and find-in-page behaviour with no JS. | web-features `details`, `details-name`; html-aria (`summary` takes no role) | HTML | static: click handler toggling `hidden` on sibling of a `<div>` | `<div onclick>` toggler → `<details><summary>` | – | info |
| a11y/disclosure-button-expanded | A custom show/hide trigger is a `<button>` with `aria-expanded` that flips true/false (`aria-controls` optional). | AT reports collapsed/expanded state. | APG disclosure | any | static: element toggling visibility without `aria-expanded`; runtime: axe cannot tell | `<a href=#>More</a>` → `<button aria-expanded=false>` | – | error |
| a11y/summary-no-role | Do not add a `role` to a `<summary>` that is its `<details>`'s summary. | html-aria allows no role there. | html-aria, `summary` row | HTML | static: `<summary role=` | `<summary role=button>` → `<summary>` | – | warning |
| a11y/accordion-heading-button | Each accordion header is a `<button>` that is the only child of a heading at the right level. | Heading navigation plus button semantics; anything else in the heading gets flattened. | APG accordion | any | static: accordion trigger not inside `h2`–`h6`/`role=heading` | `<div class=header><button>` → `<h3><button aria-expanded aria-controls>` | – | warning |
| a11y/accordion-region-limit | Give panels `role="region"` + `aria-labelledby` only when few panels can be open at once (APG suggests avoiding it beyond ~6). | Too many regions flood the landmark list. | APG accordion | any | static: count `role=region` in one accordion | 20 FAQ panels with `role=region` → drop region role | – | info |
| a11y/accordion-keys | Enter/Space toggle a header; arrow/Home/End keys are not required by the current APG page. | Keep implementations simple; optional keys must not break Tab. | APG accordion (keyboard section read 2026-11-11 lists only Enter, Space, Tab, Shift+Tab) | any | runtime | arrow keys trapping Tab → plain buttons in Tab order | – | info |

### Tabs [tabs]

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| a11y/tabs-roles | Use `tablist` > `tab` with `aria-selected` and `aria-controls`; each `tabpanel` has `aria-labelledby` to its tab; the tablist has a name. | Exposes "tab 2 of 4, selected". | APG tabs | any | static: `role=tab` outside `role=tablist`, missing `aria-selected`; runtime axe `aria-required-parent`/`aria-required-children` | buttons styled as tabs → full roles | primitives (see libraries) | error |
| a11y/tabs-one-tab-stop | Only the active tab is in the Tab order; arrow keys move between tabs (Left/Right, or Up/Down with `aria-orientation=vertical`), Home/End optional. | One tab stop per widget; arrow model is what AT users expect. | APG tabs keyboard | any | static: >1 `role=tab` with `tabindex=0` or none with `-1`; runtime | every tab `tabindex=0` → roving tabindex | – | error |
| a11y/tabs-activation-mode | Activate on focus (automatic) only when panels show without delay; otherwise require Enter/Space (manual). | Slow panels on arrow press make keyboard use painful. | APG tabs | any | manual | fetch-per-tab on arrow → manual activation | – | info |
| a11y/tabs-panel-focusable | Give a `tabpanel` `tabindex="0"` when it has no focusable content at its start. | Keyboard users must be able to reach the panel after the tablist. | APG tabs | any | static: `role=tabpanel` without focusable child and without tabindex | text-only panel → `tabindex=0` | – | warning |

### Menu, menubar [menubar], menu button [menu-button]

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| a11y/menu-not-for-site-nav | Use `role=menu`/`menubar` only for app-style command menus; plain site navigation is a `<nav>` with links (disclosure buttons for sub-lists). | Menu roles switch AT into application-style key handling and require the full arrow model; most site navs do not implement it. | APG menubar gives a navigation example but requires the full keyboard model; APG disclosure; html-aria allowed roles. The "don't" itself is project guidance, not an APG statement. | any | static: `role=menu`/`menuitem` inside `<nav>` | `<nav><ul role=menubar>` → `<nav><ul>` + disclosure `<button aria-expanded>` | – | warning |
| a11y/menu-roles-complete | Items in a `menu`/`menubar` are `menuitem`, `menuitemcheckbox` or `menuitemradio` (with `aria-checked`), separators are `separator`; parents that open submenus have `aria-haspopup` and `aria-expanded`. | Missing child roles break the widget in AT. | APG menubar | any | static + runtime axe `aria-required-children` | `<li>` children → `role=menuitem` | – | error |
| a11y/menu-keys | Arrow keys move within the menu, Enter activates, Escape closes and returns focus to the trigger, Tab leaves and closes all menus; Home/End and type-ahead are expected. | Standard menu model. | APG menubar keyboard | any | runtime | Tab moving through 12 items → roving focus + arrows | – | error |
| a11y/menu-focus-on-open | Opening a menu moves focus into it (first item; last item for Up Arrow from a menu button). | A menu that opens without focus is unusable by keyboard. | APG menu-button, menubar | any | runtime: assert focus inside after open | – | – | error |
| a11y/menubutton-attrs | A menu button is a `<button>` with `aria-haspopup="menu"` (or `true`) and `aria-expanded`; Enter, Space (and optionally Down/Up) open it. | AT announces "menu button, collapsed". | APG menu-button | any | static: button that opens `role=menu` without `aria-haspopup`/`aria-expanded` | – | – | error |

### Combobox [combobox], listbox [listbox], select

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| a11y/select-native-first | Use a native `<select>` (or `<input list>` + `<datalist>` where acceptable) unless filtering/rich options are really needed; customizable select (`appearance: base-select`) is not Baseline (no Firefox) so it must degrade to a normal select. | Custom comboboxes are the most error-prone widget; native gets mobile pickers and AT support. | web-features `select` (widely), `customizable-select` (not Baseline, Chromium 135, Safari 27), `datalist` (not Baseline) | HTML | static: `role=combobox`/`listbox` used for a plain fixed list of <~15 options | div dropdown → `<select>` | – | info |
| a11y/combobox-roles | Put `role="combobox"` on the input itself; popup is `listbox` (default), `grid`, `tree` or `dialog` (set `aria-haspopup` for non-listbox); `aria-expanded` reflects visibility; `aria-controls` points at the popup when shown. | ARIA 1.2 combobox model; the 1.0 `aria-owns` wrapper model is legacy. | APG combobox; WAI-ARIA 1.2 `combobox` | any | static: `role=combobox` on a wrapper `<div>` containing an `<input>`; `aria-owns` used for popup | ARIA 1.1 wrapper → role on `<input>` + `aria-controls` | – | error |
| a11y/combobox-activedescendant | Keep DOM focus on the input and point `aria-activedescendant` at the highlighted option (listbox/grid/tree popups); move DOM focus only into a dialog popup. | Typing must keep working while arrowing through options. | APG combobox; APG keyboard-interface | any | static: `.focus()` on option elements inside a combobox popup; runtime | focus jumps to `<li>` → `aria-activedescendant=opt-3` | – | error |
| a11y/combobox-keys | Down Arrow opens/moves into the popup, Escape closes (optionally clears), Enter accepts, Alt+Down opens without moving; typing filters. | Expected combobox keyboard model. | APG combobox | any | runtime | – | – | error |
| a11y/combobox-autocomplete | Set `aria-autocomplete` to `list`, `both` or `none` to match the actual behaviour. | Tells AT whether suggestions or inline completion appear. | APG combobox | any | static: combobox without `aria-autocomplete` when it filters | – | – | info |
| a11y/listbox-option-content | Options must not contain interactive elements, and should hold short plain text; use a grid when rows need buttons/links. | Option content is flattened into one name; nested controls are unreachable. | APG listbox | any | static: `role=option` containing `button`, `a[href]`, `input` | option with delete button → grid pattern | – | error |
| a11y/listbox-selection-attr | Use either `aria-selected` or `aria-checked` on options, not both; set `aria-multiselectable="true"` for multi-select. | Mixed state attributes confuse AT. | APG listbox | any | static: option with both attributes | – | – | warning |
| a11y/listbox-keys | Up/Down move, Home/End (strongly recommended >5 options), type-ahead (recommended >7); focus lands on the selected option or the first one. | Standard listbox model. | APG listbox | any | runtime | – | – | warning |
| a11y/listbox-dynamic-setsize | Set `aria-setsize`/`aria-posinset` when options are loaded or virtualised. | AT otherwise reports wrong counts. | APG listbox | any | static: virtualised list with `role=option` without `aria-posinset` | – | – | warning |

### Carousel [carousel]

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| a11y/carousel-pause-control | An auto-rotating carousel has a start/stop button placed first in its tab order, and rotation stops on keyboard focus inside and on hover; it restarts only on explicit user request. | Moving content must be pausable (WCAG 2.2.2); AT users who neither hover nor focus need the button. | APG carousel; WCAG 2.2.2 | any | static: carousel with autoplay timer and no button whose name toggles start/stop; manual | autoplay only → rotation button + pause on `focusin`/`mouseenter` | – | error |
| a11y/carousel-roles | Name the container (`region`/`group` + `aria-roledescription="carousel"`, label without the word "carousel"), and each slide `group` + `aria-roledescription="slide"`; tabbed variant uses `tablist`/`tabpanel`. | Gives AT a structure and slide count. | APG carousel | any | static | unlabeled `<div class=slider>` → labelled region | – | warning |
| a11y/carousel-live-off-when-rotating | If the slide wrapper is a live region, it is `aria-live="off"` while rotating and `polite` when stopped. | Otherwise every auto-advance interrupts the user. | APG carousel | any | static: `aria-live=polite/assertive` on an autoplay track | – | – | warning |
| a11y/carousel-controls-keep-focus | Next/previous/rotation controls are buttons that do not move focus when activated. | Lets users press repeatedly. | APG carousel | any | runtime | – | – | info |

### Tooltip [tooltip] (pattern still "work in progress")

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| a11y/tooltip-describedby | A tooltip has `role="tooltip"`, is referenced by the trigger's `aria-describedby`, and never takes focus. | It describes, it is not a destination. | APG tooltip | any | static: `role=tooltip` not referenced by any `aria-describedby`; tooltip containing focusable elements | `title=` only → visible tooltip on hover+focus with `aria-describedby` | – | warning |
| a11y/tooltip-focus-and-escape | Show the tooltip on keyboard focus as well as hover, and close it with Escape without moving focus. | WCAG 1.4.13 content on hover or focus (dismissible, hoverable, persistent). | APG tooltip; WCAG 1.4.13 | any | runtime/manual | hover-only `mouseenter` → also `focus`, `keydown Escape` | – | error |
| a11y/tooltip-no-interactive | Put links/buttons in a non-modal dialog or popover (toggletip), not in a tooltip. | Tooltip content cannot be reached. | APG tooltip (never receives focus) | any | static: `role=tooltip` containing `a[href]`/`button` | – | `popover` attribute (Baseline newly) for toggletip | error |
| a11y/tooltip-not-title-only | Do not rely on the `title` attribute as the only carrier of important information or as the accessible name. | `title` is last in accname and not shown on touch or keyboard focus. | AccName 1.2 §4.3 step "tooltip attribute" | HTML | static: icon button whose only name source is `title` | `<button title="Save"><svg>` → `aria-label="Save"` or visually hidden text | – | warning |

### Toolbar [toolbar], radio group [radio], window splitter [windowsplitter]

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| a11y/toolbar-when | Use `role="toolbar"` only for groups of 3+ controls, named, with one tab stop and arrow-key movement (Home/End optional). | Reduces tab stops; fewer than three is not worth the custom model. | APG toolbar | any | static: `role=toolbar` with <3 focusables or no name | – | – | info |
| a11y/toolbar-roving | Inside a toolbar, first entry focuses the first enabled control; only one control has `tabindex=0`. | Single tab stop requirement. | APG toolbar; APG keyboard-interface (roving tabindex) | any | static: all toolbar children `tabindex=0`; runtime | – | – | warning |
| a11y/radio-native | Prefer native `<input type=radio>` in a `<fieldset><legend>`; custom `radiogroup`/`radio` must implement Tab to checked-or-first, arrows move and check, Space checks. | Native radios already have this model. | APG radio; html-aria | any | static: `role=radio` on non-input | div radios → native inputs | – | warning |
| a11y/splitter-separator | A draggable pane divider is a focusable `role="separator"` with `aria-valuenow/min/max`, `aria-controls` the primary pane, a name, arrow keys to move and Enter to collapse/restore. | Pointer-only resizing excludes keyboard users (see also WCAG 2.5.7 Dragging Movements). | APG windowsplitter | any | static: resize handle with mouse handlers only | `<div onmousedown>` → focusable separator + keys | – | warning |

### Tree view [treeview], grid [grid], table [table], feed [feed]

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| a11y/tree-expanded-parents-only | In a tree, only parent `treeitem`s carry `aria-expanded`; children sit in a `group`; set `aria-level`/`aria-setsize`/`aria-posinset` when not all nodes are in the DOM. | Leaf nodes with `aria-expanded` are announced as collapsible. | APG treeview | any | static: `treeitem` with `aria-expanded` and no child group | – | – | warning |
| a11y/tree-keys | Right opens/enters, Left closes/goes to parent, Up/Down move without toggling, Home/End, type-ahead; focus enters on the selected node or the first. | Standard tree model; file-explorer style nav trees rarely need it. | APG treeview | any | runtime | site nav built as `role=tree` → nested lists + disclosure | – | warning |
| a11y/grid-only-if-interactive | Use `role="grid"` only for interactive/editable tabular data or layout grids that implement arrow navigation; static data stays a `<table>`. | Grid removes cells from normal reading and requires full key handling. | APG grid ("when not to use"); APG table | any | static: `role=grid` with no key handler in component | `<div role=grid>` for read-only data → `<table>` | – | warning |
| a11y/grid-one-tab-stop | A grid is one tab stop with arrow, Home/End, Ctrl+Home/End and Page keys; Enter/F2 switches into a cell widget and Escape back. | Composite widget contract. | APG grid | any | runtime | – | – | error |
| a11y/grid-virtual-indexes | Virtualised grids/tables set `aria-rowcount`/`aria-colcount` on the container and `aria-rowindex`/`aria-colindex` on rows/cells. | Otherwise AT reports only rendered rows. | APG grid; APG table | any | static: virtual list library + `role=grid/table` without `aria-rowcount` | – | – | warning |
| a11y/table-native | Use native `<table>` with `<th scope>` and `<caption>`; ARIA table roles only when CSS layout forces divs, and then test across AT. | Native tables are best supported. | APG table | HTML | static: `role=table` on `<div>` | – | – | info |
| a11y/sort-aria-sort | Put `aria-sort` on the header of the sorted column only, and make the sort control a `<button>` inside the header. | Announces sort state. | APG table, grid | any | static: sortable header with click handler on `<th>` and no button | `<th onclick>` → `<th aria-sort=ascending><button>` | – | warning |
| a11y/feed-structure | Infinite-scroll lists of articles use `role="feed"` containing `article`s with `aria-posinset`/`aria-setsize` (`-1` if unknown) and `aria-busy` while loading; offer a way to reach content after the feed. | Lets screen-reader reading mode work with infinite loading. | APG feed | any | static: infinite-scroll container without `role=feed`; manual | – | – | info |

### Switch [switch], checkbox [checkbox], button [button], link [link]

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| a11y/button-native | Use `<button type="button">` for actions and `<a href>` for navigation; never a `<div>`/`<span>` with a click handler. | Native elements bring focus, Enter/Space, and role. | APG button, link; html-aria | any | static: `onclick`/`@click`/`(click)` on `div`/`span` without role+tabindex+key handler (jsx-a11y `no-static-element-interactions`, svelte `a11y_no_static_element_interactions`) | `<div onclick>` → `<button type=button>` | – | error |
| a11y/link-pattern-href | `<a>` without `href` is not a link; use `href` for navigation or make it a `<button>`. | No `href` = no keyboard focus and generic role; html-aria forbids naming it. | APG link; html-aria (`a` without `href`) | HTML | static: `<a` without `href`, `href="#"`/`javascript:` with click handler | `<a onclick>` → `<button>` | – | error |
| a11y/toggle-button-pressed | A toggle button uses `aria-pressed` with a fixed label; if the label changes with state, drop `aria-pressed`. | Changing both doubles the state ("Unmute, pressed"). | APG button | any | static: element with `aria-pressed` whose text is bound to the same state variable | – | – | warning |
| a11y/switch-role | A switch is `role="switch"` on a checkbox or button with `aria-checked` true/false only (no mixed), toggled by Space, label fixed. | Announces on/off, distinct from checked. | APG switch; web-features `switch-control` not Baseline | any | static: `role=switch` with `aria-checked=mixed`; label bound to state | `<input type=checkbox switch>` alone → `<input type=checkbox role=switch>` | – | warning |
| a11y/checkbox-native-indeterminate | Use native checkboxes; for "mixed" set the `indeterminate` property, never `aria-checked` on a native checkbox. | html-aria says native state wins and `aria-checked` must not conflict. | html-aria (aria-checked rule); APG checkbox | HTML | static: `<input type=checkbox` with `aria-checked` | – | – | error |
| a11y/aria-disabled-vs-disabled | Use `disabled` when the control may vanish from Tab order; use `aria-disabled="true"` (and block activation in JS) when it must stay discoverable, e.g. menu items, tabs, toolbar items. Never both. | APG keyboard-interface guidance; html-aria forbids `aria-disabled=false` with `disabled`. | APG keyboard-interface; html-aria | any | static: both attributes; `aria-disabled` without a guard in the handler | – | – | warning |

### Slider [slider], spinbutton [spinbutton], meter [meter], breadcrumb [breadcrumb], landmarks [landmarks]

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| a11y/slider-native | Prefer `<input type=range>`; a custom `role="slider"` thumb needs `aria-valuenow/min/max`, `aria-valuetext` for non-numeric values, a name, and arrows/Home/End (Page keys optional). | APG warns touch AT support for custom sliders is weak. | APG slider | any | static: `role=slider` missing value attrs (axe `aria-required-attr`) | – | – | error |
| a11y/no-aria-value-with-native | Do not set `aria-valuemin`/`aria-valuemax` where native `min`/`max` are allowed. | html-aria: native wins; conflicting values are an error. | html-aria | HTML | static: `<input type=range/number` with `aria-value*` | – | – | warning |
| a11y/spinbutton-native | Prefer `<input type=number>` (or a text input with `inputmode`); custom spinbuttons keep focus in the text field, use Up/Down and Home/End, and set `aria-invalid` when out of range. | Increment buttons need not be tab stops. | APG spinbutton | any | static | – | – | info |
| a11y/meter-vs-progress | Use `<meter>`/`role=meter` for a value in a known range (battery, score) and `<progress>`/`progressbar` for task completion. | Different semantics; APG says meter must not show progress. | APG meter; web-features `meter`, `progress` | any | static: `<meter>` bound to upload/loading state | – | – | info |
| a11y/breadcrumb | Wrap breadcrumbs in a labelled `<nav>` (e.g. `aria-label="Breadcrumb"`) and set `aria-current="page"` on the current item. | Distinguishes it from other navs; announces current location. | APG breadcrumb | any | static: `<nav>` containing breadcrumb class without label; no `aria-current` | – | – | warning |
| a11y/landmarks-cover-content | Place all content inside landmarks (`header`, `nav`, `main`, `aside`, `footer`, `<search>`, named `form`/`section`), keep around seven or fewer, and label duplicates. | Landmark navigation is a core AT shortcut. | APG landmarks; axe `region`, `landmark-unique`, `landmark-one-main` | any | runtime axe; static: >1 `<nav>` without label | `<div role=search>` → `<search>` (Baseline widely 2026-04) | – | warning |

## ARIA in general (html-aria, AccName, WAI-ARIA 1.2)

axe-core rule ids below were read from the `axe-core@4.14.0` bundle (`axe.min.js` rule list).

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| a11y/aria-native-first | Use a native element or attribute whenever one gives the needed role, state and keyboard behaviour; add ARIA only for what HTML cannot express. | ARIA changes semantics only, never behaviour; native controls are better supported. | html-aria §1 / conformance; Using ARIA "first rule" (Discontinued Draft, background only) | any | static: role on element that has a native equivalent (`div role=button`, `span role=checkbox`, `div role=link`) | `<div role=button>` → `<button>` | – | warning |
| a11y/aria-no-redundant-role | Do not repeat an element's implicit role (`<button role=button>`, `<nav role=navigation>`, `<main role=main>`); the only common exception is `role=list` on a list whose markers were removed. | Noise; html-aria says SHOULD NOT. | html-aria, implicit roles | HTML | static: role equals implicit role (jsx-a11y `no-redundant-roles`, vuejs-accessibility `no-redundant-roles`, svelte `a11y_no_redundant_roles`) | `<ul role=list>` without `list-style:none` → `<ul>` | – | info |
| a11y/aria-allowed-role | Only use roles that html-aria permits on that element (e.g. no role on `<summary>` of its `<details>`, none on `<label>` tied to a control, none on `head`, `meta`, `script`, `style`, `template`, `slot`, `source`, `col`). | Conflicting roles break native behaviour. | html-aria, per-element table | HTML | static + axe `aria-allowed-role` | `<a href role=heading>` → `<h2><a href>` | – | error |
| a11y/aria-hidden-focusable | Never put `aria-hidden="true"` (or `role=presentation/none`) on a focusable element or on an ancestor of one; never on `<body>`. | Keyboard focus lands on something AT says does not exist. | html-aria (aria-hidden section); axe `aria-hidden-focus`, `aria-hidden-body`, `presentation-role-conflict` | any | static: `aria-hidden` on `button`/`a[href]`/`input`/`[tabindex]`; runtime axe | hidden decorative icon-button → `inert` or remove from DOM, or `aria-hidden` on the `<svg>` only | – | error |
| a11y/aria-hidden-not-with-hidden | Do not add `aria-hidden="true"` to elements already `hidden`, and never with `hidden="until-found"`. | Redundant; breaks find-in-page reveal. | html-aria (aria-hidden section) | HTML | static | – | – | info |
| a11y/aria-label-generic | Do not put `aria-label`/`aria-labelledby` on `div`, `span` or other generic elements (or `<a>` without `href`) unless a role that allows naming is set. | html-aria marks these "naming prohibited"; AT ignore or mis-read the label. | html-aria; axe `aria-prohibited-attr` | HTML | static: `aria-label` on `div`/`span`/`p`/`b`/`i` without role | `<div aria-label="Price">` → visible text, or `role=group`/`region` if a real group | – | error |
| a11y/aria-no-conflict-native | Do not mirror native attributes with ARIA (`aria-checked` on checkbox, `aria-disabled` with `disabled`, `aria-required` with `required`, `aria-readonly` with `readonly`, `aria-placeholder` with `placeholder`, `aria-valuemin/max` with `min/max`). | html-aria: browsers ignore the ARIA when both exist; `="false"` with the native attribute is a MUST NOT. | html-aria (ARIA attributes vs HTML attributes) | HTML | static: element with both pairs | `<input required aria-required=true>` → `<input required>` | – | warning |
| a11y/aria-valid-attr | Use only real `aria-*` names with valid values, and only ones supported by the element's role; supply required attributes for the role. | Typos and unsupported attributes are silently ignored. | WAI-ARIA 1.2; axe `aria-valid-attr`, `aria-valid-attr-value`, `aria-allowed-attr`, `aria-required-attr`, `aria-conditional-attr` | any | static (all linters) + runtime axe | `aria-labeledby` → `aria-labelledby` | – | error |
| a11y/aria-required-structure | Composite roles need their required owned/parent roles (`tablist`>`tab`, `listbox`>`option`, `menu`>`menuitem`, `tree`>`treeitem`, `grid`>`row`>`gridcell`). | Orphaned children are not exposed as intended. | WAI-ARIA 1.2 (required owned elements / context role); axe `aria-required-children`, `aria-required-parent` | any | runtime axe; static within one template | – | – | error |
| a11y/aria-deprecated | Do not use deprecated roles/attributes (`directory` role, `aria-grabbed`, `aria-dropeffect`, DPub `doc-biblioentry`, `doc-endnote`). | html-aria requires checkers to warn. | html-aria (deprecated); axe `aria-deprecated-role` | any | static | – | – | warning |
| a11y/accname-visible-label | Name controls from their visible text where possible and make any `aria-label` start with/contain the visible text. | WCAG 2.5.3 Label in Name; voice users say what they see. | AccName 1.2 §4.3; axe `label-content-name-mismatch` | any | static: `aria-label` on element with visible text that does not contain it | `<button aria-label="Submit form">Send</button>` → drop aria-label | – | warning |
| a11y/accname-no-placeholder | Do not use `placeholder` (or `title`) as the only label of a field. | `placeholder` is not part of the AccName algorithm; `title` is the last resort; both vanish visually. | AccName 1.2 §4.3; axe `label`, `label-title-only` | HTML | static: `<input placeholder>` without `<label>`/`aria-label(ledby)` | – | – | error |
| a11y/accname-labelledby-ids | Every id listed in `aria-labelledby`/`aria-describedby`/`aria-controls`/`aria-activedescendant` must exist and be unique in the same document/shadow root. | Broken references give empty names; references do not cross shadow roots. | AccName 1.2; axe `duplicate-id-aria` | any | static: id lookup within template; runtime axe | `useId()`/`$id` per instance instead of hard-coded ids | – | error |
| a11y/aria-live-usage | Use `aria-live="polite"` (or `role=status`) for routine updates, `assertive`/`role=alert` only for urgent ones, set `aria-atomic` when the whole region must be re-read, and never put a live region around large or frequently re-rendered content. | Over-chatty regions make pages unusable with AT. | WAI-ARIA 1.2 `aria-live`, `aria-atomic`; WCAG 4.1.3 Understanding | any | static: `aria-live` on lists/tables/whole app root; manual | `<main aria-live=polite>` → small dedicated region | – | warning |
| a11y/aria-1-3-info | Treat ARIA 1.3 additions (`ariaNotify`, `sectionheader`/`sectionfooter`) as draft; use them only as progressive enhancement. | 1.3 is a Working Draft; `ariaNotify()` is Baseline newly only since 2026-09-14. | WAI-ARIA 1.3 WD; web-features `arianotify` | any | static: usage without fallback | – | – | info |

## Focus management

| id | rule | why | source | applies to | check | bad → good | light library | sev |
|---|---|---|---|---|---|---|---|---|
| a11y/focus-visible-style | Never remove the focus outline without a replacement; style keyboard focus with `:focus-visible` (Baseline widely) and make sure it survives forced-colors mode. | WCAG 2.4.7 Focus Visible; APG says custom indicators can vanish in high-contrast modes. | APG keyboard-interface (focus visibility); web-features `focus-visible`, `forced-colors` | CSS | static: `outline: none/0` on `:focus` or `*` without a `:focus-visible` rule giving outline/box-shadow; note `box-shadow` disappears in forced colors, prefer `outline` | `:focus{outline:none}` → `:focus-visible{outline:2px solid; outline-offset:2px}` | – | error |
| a11y/focus-no-positive-tabindex | Do not use positive `tabindex`; fix order by moving DOM nodes. | APG strongly advises against it; it breaks the DOM-order = reading-order link (WCAG 2.4.3). | APG keyboard-interface; axe `tabindex` | any | static: `tabindex` > 0 (all linters) | `tabindex=3` → reorder markup | – | error |
| a11y/focus-dom-order | Keep visual order and DOM order aligned (watch CSS `order`, `flex-direction: *-reverse`, grid placement); `reading-flow` is not Baseline yet. | Tab and reading order follow the DOM. | APG keyboard-interface; web-features `reading-flow` (not Baseline) | CSS | static (heuristic): `order:` / `*-reverse` on containers with focusables; manual | – | – | warning |
| a11y/focus-roving-vs-activedescendant | In composite widgets keep one tab stop: use roving `tabindex` (0 on current, -1 on others, call `focus()`) or `aria-activedescendant` on the container when the role supports it; with activedescendant you must draw the highlight and scroll it into view yourself and keep the referenced element a descendant/owned/controlled element. | APG keyboard-interface lists both; roving gets browser scrolling and `:focus` styling for free, activedescendant keeps typing focus (needed for combobox). | APG keyboard-interface; svelte `a11y_aria_activedescendant_has_tabindex` | any | static: `aria-activedescendant` on element without tabindex/natively focusable; runtime | – | `focusgroup` attribute will replace roving later but is Chromium-only today | warning |
| a11y/focus-inert-background | Make background content non-interactive while a modal/off-canvas panel is open: `showModal()` does it; for custom overlays use the `inert` attribute (Baseline widely since 2025-10) on siblings instead of `aria-hidden` + tabindex juggling. | `inert` removes both focus and AT access in one place. | web-features `inert`; APG dialog-modal notes | HTML | static: off-canvas/drawer component without `inert` or `showModal` | `aria-hidden` on `#app` + manual tabindex → `inert` on `#app` | – | warning |
| a11y/focus-inert-not-on-visible | Do not set `inert` on content the user can still see and is expected to use. | Inert content is unclickable and unannounced. | HTML `inert` attribute (https://html.spec.whatwg.org/multipage/interaction.html#the-inert-attribute) | HTML | manual | – | – | warning |
| a11y/focus-skip-link | Provide a first-focusable "Skip to main content" link targeting `<main id>` (or rely on landmarks plus a skip link for long nav). | WCAG 2.4.1 Bypass Blocks; axe `skip-link` checks the target exists. | axe `skip-link`, `bypass`; WCAG 2.4.1 | HTML | static: first focusable in `<body>` is not an in-page link; runtime axe | – | – | warning |
| a11y/focus-skip-link-target | The skip-link target must receive focus (`tabindex="-1"` on non-focusable targets like `<main>` if the browser does not move sequential focus) and must not be hidden under a sticky header. | Otherwise the next Tab starts from the top again. | APG keyboard-interface (`tabindex=-1` for programmatic focus); WCAG 2.4.11 Understanding (C43, F110) | HTML/CSS | manual | – | – | warning |
| a11y/focus-route-change | After client-side navigation, move focus to a predictable place (the new page's `<h1>` with `tabindex=-1`, or `<body>`/main) and announce the new page title; never leave focus on a removed link. | Without a full page load, AT users get no cue that content changed. | SvelteKit docs (focuses `<body>` and announces `<title>` by default); Next.js docs (route announcer reads `document.title`, then `<h1>`, then pathname; no focus move documented); Nuxt `<NuxtRouteAnnouncer>` ≥3.12 (announces title, optional, polite by default); Angular best practices (focus main heading on `NavigationEnd`) | SPA frameworks | static: Nuxt app without `<NuxtRouteAnnouncer>`; Angular router app without a `NavigationEnd` focus handler; React Router/Vue Router apps without an announcer; manual | – | built-ins first (SvelteKit, Next.js, Nuxt) | warning |
| a11y/focus-unique-titles | Give every route a unique, descriptive `<title>`, because framework announcers read it. | SvelteKit, Next.js and Nuxt announcers use the title. | SvelteKit, Next.js, Nuxt docs above; axe `document-title` | SPA | static: route files without title/head setting; runtime | – | – | warning |
| a11y/focus-not-lost-on-delete | When a focused item is removed (deleted row, closed tab, removed chip), move focus to a neighbour or the container. | APG: focus must never fall back to `<body>`. | APG keyboard-interface (focus visibility); APG tabs (Delete key) | any | runtime / manual | – | – | warning |
| a11y/focus-scroll-padding | Make sure a focused element is never completely hidden by sticky headers/footers, cookie banners or non-modal panels; use `scroll-padding-top/bottom` equal to sticky bar heights. | WCAG 2.4.11 Focus Not Obscured (Minimum), AA; technique C43, failure F110. | WCAG 2.2 Understanding 2.4.11 | CSS | static: `position: sticky/fixed` header/footer and no `scroll-padding` on the scroll container; runtime: tab through and compare focused rect with fixed elements (no axe rule exists in 4.14.0) | – | – | error |
| a11y/focus-scroll-into-view | When script moves a virtual focus (activedescendant) or opens content, call `scrollIntoView({block:'nearest'})` on the active item. | Browser does not scroll for activedescendant. | APG keyboard-interface; web-features `scroll-into-view` | JS | manual | – | – | info |
| a11y/focus-no-autofocus-page | Avoid `autofocus` on page load outside dialogs; inside `<dialog>` it is the recommended way to choose initial focus. | Page-level autofocus skips context for AT users; the HTML spec recommends it inside dialogs. | HTML spec dialog author notes; linters `no-autofocus` / svelte `a11y_autofocus` | HTML | static: `autofocus` outside a `<dialog>`/popover | – | – | info |
| a11y/focus-popover-no-trap | A `popover` is not modal: it does not trap focus or make the page inert; it moves focus only to an `autofocus` descendant and returns focus only if focus was inside when it hides. Use `<dialog>` + `showModal()` when you need modality. | Avoids treating popovers as dialogs. | HTML spec popover section https://html.spec.whatwg.org/multipage/popover.html | HTML | manual | – | – | info |
| a11y/focus-scrollable-region | Scrollable regions with no focusable content need `tabindex="0"` and a name so keyboard users can scroll them. | Keyboard-only users cannot scroll otherwise. | axe `scrollable-region-focusable` | any | runtime axe | – | – | warning |

## Light libraries (read 2026-11-11)

Version, licence (registry `license` field), last-release date and deprecation come from the npm registry JSON
(`https://registry.npmjs.org/<name>`, `dist-tags.latest` and `time[<version>]`). Sizes are bundlephobia API results
(`https://bundlephobia.com/api/size?package=<name>`) for the **whole main entry**, min / min+gzip; for tree-shaken
component kits the real cost per component is far lower, so compare them per primitive, not per package. Bundlephobia
gave no usable number for Svelte component packages (bits-ui failed to build; `melt` reported 0.3 kB, which is only a
re-export entry), so those sizes are left out.

### Testing and linting

| package | version | licence | last release | min / min+gz (bundlephobia) | why pick it | caveats |
|---|---|---|---|---|---|---|
| axe-core | 4.14.0 | MPL-2.0 | 2026-10-05 | 662.7 kB / 186.6 kB | The rule engine behind almost every tool below; 0 dependencies; rule ids are stable and good for mapping (`aria-hidden-focus`, `aria-dialog-name`, `skip-link`, `scrollable-region-focusable`, `target-size`, …). | Test-time only, never ship it. MPL-2.0 (file-level copyleft) is fine for dev use; note it in a licence report. No rule for 2.4.11 focus-not-obscured or for keyboard models. |
| @axe-core/playwright | 4.14.0 | MPL-2.0 | 2026-10-15 | – (dev only) | Runs axe inside real browser pages in Playwright e2e tests; `AxeBuilder` with tag filters (`wcag2a`, `wcag2aa`, `wcag22aa`). Best default for "runtime" checks. | Needs a running app; only checks the states you drive the page into (open the dialog, then scan). |
| @axe-core/react | 4.14.0 | MPL-2.0 | 2026-10-15 | 668.7 kB / 189.2 kB | Logs axe results to the dev console. | Not marked deprecated on npm, but its README says it **does not support React 18 and above** and points to Deque's paid-tier "axe Developer Hub" (https://github.com/dequelabs/axe-core-npm/blob/develop/packages/react/README.md). Do not recommend for new projects. |
| jest-axe | 11.0.0 | MIT | 2026-07-26 | – (dev only) | `toHaveNoViolations` matcher for Jest + jsdom component tests. Maintained. | jsdom has no layout: contrast, target size and visibility rules cannot be judged; use for structure/ARIA only. |
| vitest-axe | 0.1.0 (latest), 1.0.0-pre.5 (pre tag) | MIT | 0.1.0: 2022-10-21; last publish 2025-01-22 (pre.5) | – (dev only) | Vitest port (fork) of jest-axe matchers. | Stable tag unchanged since 2022, only pre-releases since; README says it does not work under `happy-dom` (isConnected bug), use jsdom. Alternative: call `axe.run()` directly in Vitest browser mode, or Storybook a11y + Vitest addon. Mark "maintenance: low". |
| eslint-plugin-jsx-a11y | 6.10.2 | MIT | 2024-10-26 | – (dev only) | The static JSX rule set (also enabled by `eslint-config-next`, per Next.js docs). | No release for two years; peer range is `eslint ^3…^9` and does **not** list ESLint 10 (ESLint 10.0.0 shipped 2026-02-06, latest 10.14.0). Projects on ESLint 10 may hit peer warnings; recheck before recommending. |
| eslint-plugin-vuejs-accessibility | 2.6.3 | MIT | 2026-10-21 | – | 23 rules for `.vue` templates (`alt-text`, `no-aria-hidden-on-focusable`, `no-redundant-roles`, `tabindex-no-positive`, `form-control-has-label`, …); flat config `configs["flat/recommended"]`; peer ESLint ≤10. | Template-only; cannot see runtime ARIA bound from script. |
| @angular-eslint/eslint-plugin-template | 22.6.0 | MIT | 2026-10-11 | – | 11 accessibility rules for Angular templates: `alt-text`, `click-events-have-key-events`, `elements-content`, `interactive-supports-focus`, `label-has-associated-control`, `mouse-events-have-key-events`, `no-autofocus`, `no-distracting-elements`, `role-has-required-aria`, `table-scope`, `valid-aria` (README). | Exact name of the premade accessibility config not confirmed (see Not verified). |
| Svelte compiler | (built in) | MIT (svelte) | – | 0 | Svelte emits 42 `a11y_*` compiler warnings (e.g. `a11y_no_static_element_interactions`, `a11y_click_events_have_key_events`, `a11y_no_redundant_roles`, `a11y_aria_activedescendant_has_tabindex`, `a11y_positive_tabindex`); silence one per line with `<!-- svelte-ignore code (reason) -->`. | Warnings, not errors; teams often silence them. A rule could flag `svelte-ignore a11y_*` without a reason. |
| eslint-plugin-lit-a11y | 5.1.3 | ISC | 2026-10-13 | – | a11y rules for Lit `html` templates (web components). | Smaller community. |
| @storybook/addon-a11y | 10.6.7 | MIT | 2026-11-10 | – | axe in the Storybook panel per story; `parameters.a11y.test`: `'off'`, `'todo'` (warn), `'error'` (fails in UI and CI via the Vitest addon). Good for component libraries. | Docs repeat Deque's "up to 57% of WCAG issues" figure: say "part of the problems", never more. Only checks rendered story states. |
| axe Linter (Deque) | VS Code / JetBrains extension, SaaS/on-prem server | proprietary (free personal VS Code edition per Deque; server needs API key) | – | – | Lints `.jsx/.tsx`, `.vue`, Angular `.component.html`, `.html`, Liquid, HTL, Markdown with axe rule ids (https://docs.deque.com/linter/4.0.0/en/linter-home/). | Not an npm dev dependency, not open source; do not make it a required part of the skill. |

### Focus and dialog helpers (framework-free)

| package | version | licence | last release | min / min+gz | why pick it | caveats |
|---|---|---|---|---|---|---|
| (native) `<dialog>`, `inert`, `popover`, `<details name>` | – | – | – | 0 | Covers modal dialogs, background inertness, non-modal popups and accordions with no JS library (Baseline table above). | `popover` is Baseline newly (2025-01); `closedby` and `popover=hint` are not Baseline. |
| tabbable | 6.5.1 | MIT | 2026-10-24 | 6.1 kB / 2.4 kB | Finds tabbable/focusable elements in a container; 0 deps; used by focus-trap and bits-ui. | Visibility checks depend on layout, so results in jsdom differ from a real browser. |
| focus-trap | 8.2.4 | MIT | 2026-10-26 | 19.9 kB / 6.6 kB | Robust trap for custom overlays that cannot use `showModal()` (drawers, legacy modals); handles return focus and Escape. One dep (tabbable). | Not needed for native modal `<dialog>`. React wrapper `focus-trap-react@12.0.3` (MIT, 2026-06-22) is 8.5 kB gz. |
| a11y-dialog | 8.1.5 | MIT | 2026-02-06 | 4.9 kB / 1.8 kB | Smallest complete APG-style dialog script (name, trap, Escape, return focus, alertdialog support) for sites that cannot use native `<dialog>` behaviour. | One dep (`focusable-selectors`). Native `<dialog>` is the first choice now. |

### Component primitives (headless)

| package | version | licence | last release | min / min+gz (whole entry) | why pick it | caveats |
|---|---|---|---|---|---|---|
| react-aria (hooks) / react-aria-components | 3.53.1 / 1.22.1 | Apache-2.0 | 2026-10-09 | RAC whole: 990.7 kB / 279.1 kB; single hook package `@react-aria/dialog` 3.4 kB gz | Hooks and unstyled components; site lists 50+ components incl. ComboBox, Select, ListBox, Table, DatePicker, Menu, Modal, accessible drag and drop, translations in 30+ languages and RTL (https://react-aria.adobe.com/). Import per hook/component. | Large API; whole-package size is big, tree-shaking matters. Apache-2.0 (permissive, has NOTICE duties). |
| radix-ui (unified) / @radix-ui/react-* | 1.8.1 / dialog 1.3.1 | MIT | 2026-10-12 | `@radix-ui/react-dialog`: 39.5 kB / 13.2 kB | Popular unstyled React primitives (dialog, dropdown menu, tabs, popover, tooltip, toast…); per-primitive packages keep size down. | No combobox/grid/tree primitives; check each primitive's keyboard notes. |
| @headlessui/react | 2.2.10 | MIT | 2026-04-07 | 209.4 kB / 63.0 kB | Small component set; depends on `@react-aria/focus`, `@react-aria/interactions` and `@floating-ui/react` (registry deps). | Fewer components; last release seven months ago. |
| @headlessui/vue | 1.7.23 | MIT | 2024-09-09 | 137.3 kB / 35.9 kB | Vue 3 version of the same library. | Stable line not released for over two years (only "insiders" builds, last 2026-04-13): treat as low maintenance; prefer Reka UI for Vue. |
| @base-ui/react | 1.9.0 | MIT | 2026-10-09 | 522.8 kB / 166.4 kB | Unstyled React components, an actively released alternative to Radix. | Old name `@base-ui-components/react` is deprecated on npm ("renamed to @base-ui/react"). |
| @zag-js/* | 1.47.0 | MIT | 2026-10-26 | `@zag-js/dialog` 45.0 kB / 14.5 kB + `@zag-js/react` 4.2 kB gz | Framework-agnostic state machines for APG widgets (React, Vue, Solid, Svelte adapters); good when one design system must serve several frameworks. | You still wire the markup; per-machine packages. |
| @ark-ui/react, /vue, /svelte, /solid | 5.40.0 (svelte 5.25.1) | MIT | 2026-10-29 (svelte 2026-11-02) | react whole: 1072.7 kB / 296.9 kB | Ready headless components built on Zag (68 of 69 deps are `@zag-js/*`); same API in four frameworks. | Many deps; size only acceptable with tree-shaking. |
| reka-ui (Vue) | 2.11.0 | MIT | 2026-10-05 | 832.6 kB / 188.7 kB | Actively released headless component set for Vue 3 (deps include Floating UI, TanStack Virtual, `@internationalized/date`). | Tree-shake; Vue ≥3.4. |
| bits-ui (Svelte 5) | 2.21.0 | MIT | 2026-11-11 | n/a (bundlephobia failed) | Maintained headless components for Svelte 5; deps include tabbable and Floating UI. | Svelte ^5.33 only. |
| melt (Svelte 5) / @melt-ui/svelte (legacy) | 0.44.0 / 0.86.6 | MIT | 2026-01-04 / 2025-03-28 | n/a | Builder-style (attribute spreads) primitives; `melt` is the Svelte 5 line. | `melt` is pre-1.0 and was last released ten months ago; `@melt-ui/svelte` is the older line. Prefer bits-ui for components. |
| @angular/cdk (a11y) | 22.2.7 | MIT | 2026-11-11 | – | `cdkTrapFocus`, `LiveAnnouncer`, `FocusMonitor`, `FocusKeyManager`/`ActiveDescendantKeyManager`, `InteractivityChecker`, `.cdk-visually-hidden` (https://github.com/angular/components/blob/main/src/cdk/a11y/a11y.md). Usually already installed with Angular Material. | Low-level; you build the pattern. |
| @angular/aria | 22.2.7 | MIT | 2026-11-11 | – | Headless directives for accordion, autocomplete, combobox, grid, listbox, menu, menubar, multiselect, select, tabs, toolbar, tree (https://angular.dev/guide/aria/overview). | Peer-depends on `@angular/cdk`; stability level today not confirmed (see Not verified). |

### Recommended light default per stack

| stack | default | why | trade-off |
|---|---|---|---|
| Plain HTML/JS, Astro, server-rendered | Native `<dialog>` + `showModal()`, `<details name>`, `popover`, `inert`, `<search>`; `a11y-dialog` (1.8 kB gz) or `focus-trap` (6.6 kB gz) only for legacy/custom overlays. Tests: `@axe-core/playwright`. | Zero-JS or near-zero JS, Baseline. | Combobox, grid, tree, menu still need hand-written keyboard code; follow APG closely. |
| React / Next.js | `eslint-plugin-jsx-a11y` (+ Next's built-in route announcer); Radix per-primitive packages for menus/dialogs/tabs; React Aria (Components) when combobox, grid, tree or date inputs are needed. Tests: `@axe-core/playwright`, jest-axe or Storybook a11y. | Radix dialog is 13.2 kB gz on its own; React Aria covers the hard widgets (combobox, table, date). | jsx-a11y lags ESLint 10; `@axe-core/react` unsupported on React ≥18. |
| Vue / Nuxt | `eslint-plugin-vuejs-accessibility`; Reka UI; Nuxt `<NuxtRouteAnnouncer>` (≥3.12) and `<NuxtAnnouncer>`/`useAnnouncer` (≥4.4.2). | Reka is the maintained, broad option. | Headless UI Vue is stale. |
| Svelte / SvelteKit | Svelte compiler `a11y_*` warnings (keep them on, require a reason when ignoring); SvelteKit's built-in route announcement and `<body>` focus; bits-ui for complex widgets. | Built-ins cost nothing; bits-ui is the active Svelte 5 kit. | Melt line is pre-1.0. |
| Angular | `@angular-eslint/eslint-plugin-template` accessibility rules; CDK a11y (`cdkTrapFocus`, `LiveAnnouncer`, key managers); `@angular/aria` for APG widgets once its stability is confirmed; focus main heading on `NavigationEnd`. | First-party, already in the dependency tree. | Angular Router has no built-in route announcer documented on the a11y page. |
| Multi-framework design system | Zag.js machines or Ark UI. | One behaviour layer for several frameworks. | Larger dependency graph. |
| Web components (Lit) | `eslint-plugin-lit-a11y`; native elements inside shadow DOM; `aria-labelledby` ids must live in the same shadow root. | Cross-root ARIA references do not work yet (`referencetarget` is Chromium-only per web-features). | – |

## Notes for skill authors

- Ids shared with [accessibility.md](accessibility.md): that file owns the success-criterion rules. `a11y/link-pattern-href` here is the APG-pattern side of `a11y/link-is-link`, and `a11y/focus-scroll-padding` the technique side of `a11y/focus-not-obscured` (2.4.11); merge them when the dictionary is written.

- **Short skill vs reference file.** Short skill: native-first table (dialog/details/popover/inert/search/select with
  Baseline), the "never" list (`aria-hidden` on focusable, `aria-label` on generic `div`/`span`, positive tabindex,
  `outline:none` without `:focus-visible`, click on `div`, `<a>` without `href`, `role=menu` for site nav, `title`
  or `placeholder` as only label), dialog focus trio (initial / contained / return), live-region basics, route-change
  focus+announce per framework, and one light default per stack. Reference file: the full per-pattern keyboard tables
  (tabs, menu, combobox, listbox, tree, grid, toolbar, splitter, feed) — load only when the agent builds that widget.
- **Static vs runtime.** Most rows above can only be partly detected in source. Safe static checks: attributes and
  roles (html-aria tables), positive tabindex, `aria-hidden` on focusables, `aria-label` on generics, dialogs without
  names, `role=tab` without `tablist`, `outline:none`. Keyboard models, focus placement, announcement timing and
  2.4.11 need Playwright scripts or a person. Say so in every report; axe catches only part of the problems.
- **Noisy / controversial.** `a11y/menu-not-for-site-nav` is community practice, not an APG statement (APG ships a
  navigation menubar example) — keep it "warning" with a clear note. `role=list` on styled `<ul>` is an accepted
  exception to "no redundant roles". `autofocus` is discouraged on pages but recommended inside `<dialog>` — scope the
  lint rule. Tooltip pattern has no task-force consensus. Toast has no APG pattern; label toast rules as derived from
  Alert + WCAG 4.1.3/2.2.x. Severity of jsx-a11y `no-static-element-interactions` style rules is often argued; keep
  "error" only when no role+tabindex+key handler is present.
- **Recheck often.** Baseline dates (popover reaches "widely" around 2027-07; `details name`, invoker commands,
  `requestClose`, `ariaNotify` are "newly"); not-yet-Baseline items (`closedby`, `popover=hint`, interest invokers,
  customizable select, `focusgroup`, `reading-flow`, `hidden=until-found`, `switch` attribute, `referencetarget`).
  ARIA 1.3 status. Library versions/maintenance, especially eslint-plugin-jsx-a11y vs ESLint 10, vitest-axe,
  @headlessui/vue, melt, @angular/aria stability, @axe-core/react support. APG pages change without version numbers
  (accordion page today no longer lists arrow keys).
- **Severity defaults used here.** error = blocks keyboard/AT use or breaks a MUST in html-aria/WCAG; warning =
  likely problem or SHOULD; info = native-first suggestion or progressive enhancement.

## Not verified

- **Angular Aria stability today.** angular.dev overview shows only a "New" label; third-party articles say it
  launched as developer preview in v21 (Nov 2025). Not confirmed on a primary page for v22.2.7 — check
  https://angular.dev/guide/aria/overview and the Angular release notes before calling it stable.
- **@angular-eslint accessibility preset name** (e.g. `templateAccessibility`). README refers to an "accessibility
  preset" and to `packages/angular-eslint/src/configs`; the exact export name was not read.
- **Using ARIA fifth rule.** Older editions listed a fifth rule (interactive elements need an accessible name); the
  current Discontinued Draft shows four. Not checked which edition dropped it.
- **Implicit `aria-expanded` on `popovertarget` invokers** (HTML-AAM mapping) — not read in HTML-AAM; do not tell
  authors to omit or add `aria-expanded` on popover buttons until checked at https://www.w3.org/TR/html-aam-1.0/.
- **a11y-dialog v8 and native `<dialog>`**: the docs site home did not say whether v8 uses the `<dialog>` element;
  "Dialog element" docs page not read.
- **vitest-axe last commit date** (GitHub API returned 403); maintenance judged only from npm publish dates.
- **axe Linter pricing/licence**: Deque docs mention SaaS API key and a free trial; the "free personal VS Code edition"
  wording comes from a search summary of the Marketplace listing, not read directly.
- **Svelte package sizes** (bits-ui, melt, @ark-ui/svelte) — bundlephobia failed or gave a meaningless entry size;
  pkg-size.dev not tried.
- **Per-component sizes for React Aria Components, Reka UI, Ark UI, Base UI** — only whole-entry sizes measured;
  bundlephobia "exports sizes" view not read.
- **Licence files**: licences come from the registry `license` field (allowed by the brief); LICENSE files were opened
  only for axe-core (MPL-2.0) and web-features (Apache-2.0).
- **Melt `melt` vs `@melt-ui/svelte` relationship** (which is the official successor) — inferred from peer
  dependencies (Svelte 5 only vs Svelte 3–5); not stated on a primary page read today.
- **Screen-reader support claims** for any library (e.g. which AT React Aria tests with) — the React Aria site says
  "many popular screen readers" without naming them.
