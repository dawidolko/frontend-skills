# WCAG 2.2 A and AA, mapped to front-end code

Depth for the `fe-a11y-core` skill. WCAG 2.2 is the W3C Recommendation of 12 December 2024 (read on 2026-11-11): 31 level A and 24 level AA criteria, 55 in all for an AA target. 4.1.1 Parsing is obsolete and removed in 2.2. Rule ids: `frontend-skills explain <id>`.

Checked by: **S** the static audit (`audit`), **B** the page audit (`audit --url`: axe-core and Lighthouse), **P** a person. Most criteria need a person even when a tool covers part of them.

## Perceivable

| SC | Level | In code | Rules or skill | Checked by |
| --- | --- | --- | --- | --- |
| 1.1.1 Non-text Content | A | `alt` on images (empty when decorative), names on icons and image buttons | a11y/img-alt, a11y/control-name | S B P |
| 1.2.1 Audio-only, Video-only | A | Transcript; or audio track for silent video | a11y/media-alternative | P |
| 1.2.2 Captions (Prerecorded) | A | `<track kind="captions">` or player captions | a11y/video-captions | S P |
| 1.2.3 Audio Description or Alternative | A | Described audio or a full text alternative | a11y/media-alternative | P |
| 1.2.4 Captions (Live) | AA | Real-time captions for live streams | fe-a11y-media | P |
| 1.2.5 Audio Description | AA | Described audio for recorded video | a11y/media-alternative | P |
| 1.3.1 Info and Relationships | A | Headings, lists, `th`, `label`, `fieldset`, landmarks in the DOM | a11y/table-headers, a11y/input-label, a11y/landmarks, a11y/aria-ref-exists | S B P |
| 1.3.2 Meaningful Sequence | A | DOM order equals reading order; no CSS reordering of meaning | fe-a11y-keyboard | P |
| 1.3.3 Sensory Characteristics | A | Instructions not only by shape, place, colour or sound | – | P |
| 1.3.4 Orientation | AA | No orientation lock | fe-responsive | B P |
| 1.3.5 Identify Input Purpose | AA | `autocomplete` tokens on personal-data fields | a11y/autocomplete-valid | S B |
| 1.4.1 Use of Color | A | A second cue beyond colour | a11y/no-color-only | B P |
| 1.4.2 Audio Control | A | No autoplaying sound | a11y/no-autoplay-audio | S B |
| 1.4.3 Contrast (Minimum) | AA | 4.5:1 text, 3:1 large text | a11y/color-contrast | B P |
| 1.4.4 Resize Text | AA | No zoom block; text grows to 200% | a11y/zoom-not-blocked, a11y/font-size-relative | S B P |
| 1.4.5 Images of Text | AA | Real text, not pictures of text | – | P |
| 1.4.10 Reflow | AA | One column at 320 CSS px | a11y/reflow | P |
| 1.4.11 Non-text Contrast | AA | 3:1 for control borders, states, focus rings, icons | a11y/non-text-contrast | P |
| 1.4.12 Text Spacing | AA | No clipping with wider spacing | a11y/text-spacing | B P |
| 1.4.13 Content on Hover or Focus | AA | Dismissible, hoverable, persistent popups | a11y/hover-content-dismissible | P |

## Operable

| SC | Level | In code | Rules or skill | Checked by |
| --- | --- | --- | --- | --- |
| 2.1.1 Keyboard | A | Native controls; key handlers on custom widgets | a11y/no-click-on-static, a11y/link-is-link, a11y/scrollable-region-focusable | S B P |
| 2.1.2 No Keyboard Trap | A | Focus can always leave | a11y/no-keyboard-trap | P |
| 2.1.4 Character Key Shortcuts | A | Single-key shortcuts can be turned off or remapped | fe-a11y-keyboard | P |
| 2.2.1 Timing Adjustable | A | No timed refresh; warn and extend session limits | a11y/no-meta-refresh, a11y/toast-timing | S B P |
| 2.2.2 Pause, Stop, Hide | A | Pause for motion over 5 s and auto-updates | a11y/pause-auto-motion, a11y/carousel-controls | B P |
| 2.3.1 Three Flashes | A | At most three flashes a second | a11y/no-flash | P |
| 2.4.1 Bypass Blocks | A | Skip link and landmarks | a11y/skip-link, a11y/landmarks | B P |
| 2.4.2 Page Titled | A | Unique `<title>` per page and route | a11y/page-title | S B P |
| 2.4.3 Focus Order | A | No positive `tabindex`; focus into dialogs and after route changes | a11y/positive-tabindex, a11y/dialog-focus, a11y/focus-route-change | S P |
| 2.4.4 Link Purpose | A | Link text says where it goes; icon links named | a11y/control-name | S B P |
| 2.4.5 Multiple Ways | AA | Navigation plus search or a sitemap | – | P |
| 2.4.6 Headings and Labels | AA | Headings and labels describe the content | – | P |
| 2.4.7 Focus Visible | AA | Visible `:focus-visible` style | a11y/focus-visible | S P |
| 2.4.11 Focus Not Obscured | AA | `scroll-padding` for sticky bars | a11y/focus-not-obscured | P |
| 2.5.1 Pointer Gestures | A | Buttons for pinch and swipe actions | fe-a11y-keyboard | P |
| 2.5.2 Pointer Cancellation | A | Act on `click`, not on down events | fe-a11y-keyboard | P |
| 2.5.3 Label in Name | A | Accessible name contains the visible label | fe-a11y-aria | B P |
| 2.5.4 Motion Actuation | A | Shake and tilt have a button alternative | – | P |
| 2.5.7 Dragging Movements | AA | Click alternative for every drag | fe-a11y-keyboard | P |
| 2.5.8 Target Size (Minimum) | AA | 24 by 24 CSS px or spacing | a11y/target-size | B P |

## Understandable

| SC | Level | In code | Rules or skill | Checked by |
| --- | --- | --- | --- | --- |
| 3.1.1 Language of Page | A | Valid `<html lang>` | a11y/html-lang, a11y/lang-valid | S B |
| 3.1.2 Language of Parts | AA | `lang` on passages in another language | a11y/lang-valid | S B P |
| 3.2.1 On Focus | A | Focus never navigates or submits | – | P |
| 3.2.2 On Input | A | Changing a field never submits or navigates by itself | fe-a11y-forms | P |
| 3.2.3 Consistent Navigation | AA | Navigation from one shared layout | – | P |
| 3.2.4 Consistent Identification | AA | Same function, same name and icon | – | P |
| 3.2.6 Consistent Help | A | Help links in the same place on every page | – | P |
| 3.3.1 Error Identification | A | Text error linked to the field, `aria-invalid` | a11y/form-errors | P |
| 3.3.2 Labels or Instructions | A | Visible labels; required and format stated | a11y/input-label | S B P |
| 3.3.3 Error Suggestion | AA | Say how to fix the input | a11y/form-errors | P |
| 3.3.4 Error Prevention | AA | Review, confirm or undo for legal, financial, data-deleting submits | fe-a11y-forms | P |
| 3.3.7 Redundant Entry | A | Pre-fill what the user already entered | fe-a11y-forms | P |
| 3.3.8 Accessible Authentication | AA | Allow paste and password managers; no puzzles as the only way in | fe-a11y-forms | P |

## Robust

| SC | Level | In code | Rules or skill | Checked by |
| --- | --- | --- | --- | --- |
| 4.1.2 Name, Role, Value | A | Names, valid roles, states, no `aria-hidden` on focusables, titled iframes | a11y/control-name, a11y/aria-valid, a11y/aria-hidden-focusable, a11y/iframe-title, a11y/state-exposed, a11y/dialog-name | S B P |
| 4.1.3 Status Messages | AA | Live regions for messages without focus change | a11y/status-message-live | P |

## What tools cover

- axe-core 4.14 has rules tagged for 22 of the 55 criteria; 33 have no automated rule at all, including five of the six A and AA criteria new in 2.2 (only 2.5.8 has one, and it is off by default).
- "Has a rule" does not mean "checked": a tool finds a missing `alt`, never a wrong one.
- Lighthouse's accessibility score is a weighted pass or fail over a subset of axe rules; 100 means no weighted audit failed, nothing more.
- Write results as "found N problems; M items need a person".

## Manual checklist for a release

Keyboard walk (every control, visible focus, no trap, Escape closes) · screen reader pass on changed parts (names, states, announcements) · zoom to 400% and a 320px window · text spacing override · reduced motion · colour-only cues · alt text and link text meaning · error messages and recovery · captions and transcripts · consistent navigation and help.

## Sources

- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Understanding WCAG 2.2: https://www.w3.org/WAI/WCAG22/Understanding/
- How to Meet WCAG (quick reference): https://www.w3.org/WAI/WCAG22/quickref/
- axe-core rule descriptions: https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
- Lighthouse accessibility scoring: https://developer.chrome.com/docs/lighthouse/accessibility/scoring
- Research notes of this repository: `docs/sources/accessibility.md`
