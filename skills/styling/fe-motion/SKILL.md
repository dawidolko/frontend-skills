---
name: fe-motion
description: Adds smooth, safe motion - transitions and keyframes on transform and opacity, prefers-reduced-motion, pause controls for auto-playing content, View Transitions and scroll-driven animations with feature checks, @starting-style for entry effects, and motion libraries set for reduced motion. Use when animating UI, adding page transitions, parallax or a carousel, or when an animation stutters.
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Motion and animation
  area: styling
  lane: A
  requires: web
  globs: "**/*.css **/*.scss **/*.less **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro"
  rules: "css/animate-composited css/reduced-motion css/pause-auto-motion css/limited-needs-supports"
  version: 0.1.0
---

# Motion and animation

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Animate `transform` (`translate`, `scale`, `rotate`) and `opacity`, never `width`, `height`, `top`, `left` or `margin` (css/animate-composited).
- Non-essential motion runs only under `@media (prefers-reduced-motion: no-preference)` or is toned down under `reduce` (css/reduced-motion).
- Anything that moves on its own for more than five seconds has a pause control and stops on focus and hover (css/pause-auto-motion).
- Scroll-driven animations and anchor-positioned effects sit in `@supports` with a still fallback (css/limited-needs-supports).
- Call `document.startViewTransition` only after checking it exists; cross-document view transitions are an enhancement.
- Keep UI transitions short (about 150–300 ms) and purposeful; never animate for its own sake.
- Entry effects use `@starting-style`, exit effects `transition-behavior: allow-discrete`, not timers.
- `will-change` only to fix a measured problem, never on many elements.
- Animation libraries follow the user setting (Motion `MotionConfig reducedMotion="user"`, `useReducedMotion`).
- No flashing more than three times per second.

## Do this

1. Find existing motion: tokens for duration and easing (`--duration-fast`, `--ease-out`), the global reduced-motion block, the animation library and its config.
2. Choose the property: movement is `translate`, growth is `scale` or `grid-template-rows: 0fr → 1fr`, appearance is `opacity`.
3. Write the motion inside `prefers-reduced-motion: no-preference`, or write a reduced variant (a fade instead of a slide) under `reduce`.
4. For page transitions, feature-check the View Transition API and keep navigation working without it.
5. Give carousels, marquees and background videos a pause button; do not autoplay under reduced motion.
6. Profile in DevTools (Performance panel, rendering "Paint flashing"): no long frames, no layout in the animation.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports transitions and keyframes on layout properties, a project with motion and no reduced-motion handling, and scroll timelines outside `@supports`.
- By hand: turn on "reduce motion" in the operating system (or emulate it in DevTools Rendering) and use the page; pause every moving element with the keyboard.

## References

- [references/motion.md](references/motion.md): durations and easing tokens, compositor-friendly recipes, reduced-motion patterns in CSS and JavaScript, View Transitions, scroll-driven animations, `@starting-style`, motion libraries and Baseline dates. Read it when you add an animation or a page transition.
