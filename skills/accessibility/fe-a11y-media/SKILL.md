---
name: fe-a11y-media
description: Makes audio, video and moving content usable to WCAG 2.2 AA as a target - captions with track, transcripts, audio description, no autoplaying sound, pause controls for anything that moves or loops, no flashing, reduced motion. Use when adding a video or audio player, a background video, an animated hero, a GIF or a ticker, or when asked "does this video need captions".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Media, motion and flashing
  area: accessibility
  lane: C
  requires: web
  globs: "**/*.html **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro **/*.component.html **/*.css **/*.scss"
  rules: "a11y/video-captions a11y/media-alternative a11y/no-autoplay-audio a11y/pause-auto-motion a11y/no-flash"
  version: 0.1.0
---

# Media, motion and flashing

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson (for example the project's video player) wins over this skill.

## Rules

- Recorded video with speech has captions: `<track kind="captions" src="….vtt" srclang default>` (a11y/video-captions).
- Recorded audio has a transcript next to it; video has audio description or a full text alternative (a11y/media-alternative).
- Nothing plays sound by itself; an autoplaying video is `muted` and `playsinline` (a11y/no-autoplay-audio).
- Anything that moves, loops or auto-updates for over 5 seconds has a visible pause control (a11y/pause-auto-motion).
- Nothing flashes more than three times a second (a11y/no-flash).
- Players show native `controls` or a custom control bar of real `<button>`s with names and states.
- Start non-essential motion only inside `@media (prefers-reduced-motion: no-preference)`.
- Never `<marquee>` or `<blink>`; never an animated GIF longer than 5 seconds without a way to stop it.

## Do this

1. Find the player: a native `<video>`, a library (Video.js, Plyr, Vidstack), or an embed (YouTube, Vimeo). Check that captions and keyboard controls are switched on in its configuration.
2. Store captions as WebVTT beside the media file; name it `<file>.<lang>.vtt`; add one `<track>` per language.
3. Put the transcript link right under the player, as HTML.
4. For background video: `autoplay muted loop playsinline`, a pause button, and no autoplay under reduced motion.
5. Replace large GIFs with `<video autoplay muted loop playsinline>` plus a pause control (smaller files and pausable).

## Check

- `npx github:dawidolko/frontend-skills audit --changed` finds videos without a captions track and media that autoplays with sound.
- By hand: play with sound off (captions readable and in sync), with the screen off (transcript or description is enough), with the keyboard only, and with reduced motion turned on in the OS.

## References

- [references/media.md](references/media.md): WebVTT and track examples, what each WCAG media criterion asks at A and AA, background video and reduced motion code, embed settings. Read it when adding a player or moving content.
