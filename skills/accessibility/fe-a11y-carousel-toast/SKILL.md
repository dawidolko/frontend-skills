---
name: fe-a11y-carousel-toast
description: Builds carousels, sliders of content, toasts, snackbars and notifications that people can pause, operate and hear (WAI-ARIA APG Carousel and Alert patterns, WCAG 2.2.1, 2.2.2, 4.1.3 at AA as a target). Use when adding a hero slider, product carousel, testimonial rotator, toast system, snackbar or notification banner, or when asked "is this carousel accessible".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Carousels and toasts
  area: accessibility
  lane: C
  requires: web
  globs: "**/*.html **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro **/*.component.html"
  rules: "a11y/carousel-controls a11y/pause-auto-motion a11y/toast-timing a11y/status-message-live a11y/control-name"
  version: 0.1.0
---

# Carousels and toasts

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson (for example the project's toast library) wins over this skill.

## Rules

- A carousel has named previous and next buttons, slide labels ("2 of 5") and a container label (a11y/carousel-controls).
- Auto-rotation has a pause button first in the carousel's Tab order and stops on hover and focus (a11y/carousel-controls).
- Anything that moves by itself for more than 5 seconds can be paused (a11y/pause-auto-motion).
- Toasts with actions or needed information stay until closed; others pause on hover and focus (a11y/toast-timing).
- Toasts are announced from one live region that is always in the page (a11y/status-message-live).
- Icon-only arrows, dots and close buttons have names (a11y/control-name).
- Never move focus into a toast; never put the only copy of important information in a toast.
- Respect `prefers-reduced-motion`: no auto-rotation and no slide animation when it is set.

## Do this

1. Question the carousel: a static grid or a single hero often works better for everyone. If it stays, start with auto-rotation off.
2. Build it as a list of slides with buttons, not a library that hides off-screen slides only with `transform`; make hidden slides `inert` or `hidden` so their links leave the Tab order.
3. Use CSS scroll snap for swipeable rows (`scroll-snap-type: x mandatory`) and add real buttons for people who cannot swipe.
4. For toasts, mount one container with `role="status"` (and one `role="alert"` for errors) in the root layout; the toast function only writes into it.
5. Keep a history: if a toast carried something important, it is also visible somewhere stable (a notifications page, the form itself).

## Check

- `npx github:dawidolko/frontend-skills audit --changed` finds unnamed icon buttons in carousels and toasts.
- By hand: tab into the carousel (rotation stops, the pause button comes first), use it with the keyboard, turn on reduced motion; trigger each toast with a screen reader running and act on it before it goes.

## References

- [references/carousel-toast.md](references/carousel-toast.md): carousel markup and script with pause logic, scroll snap rows, a toast region and queue, library notes. Read it when building either component.
