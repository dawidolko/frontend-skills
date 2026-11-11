# The Frontend Skills video

A 2:30 video that shows the tool, ready for a voice-over, in two layouts: YouTube 16:9 (1920×1080) and TikTok 9:16
(1080×1920), each in English and Polish, with the Frontend Skills mark as a watermark (70 % opacity, top right on
YouTube, top left below the app's own bar on TikTok).

Everything on screen comes from real runs: the build copies the fixture projects, runs `init`, `audit` and `explain`,
installs for four agents, audits a project with its own Sass and icon helpers, applies the fixes in `fix/` and audits
again, builds the site and screenshots its dictionary. Nothing is typed in by hand except the words in `timeline.mjs`.

| File | What it is |
| --- | --- |
| `timeline.mjs` | Scene lengths, the moments inside each scene, sound cues, narration slots (Polish and English), on-screen text |
| `index.html`, `scenes.css`, `player.mjs` | The stage: every frame is a function of its time, so frames are the same on every build |
| `audio.mjs` | The sound track, synthesised (whooshes, clicks, pops, ticks, chimes, a riser); no downloaded sounds |
| `build.mjs` | Records the data, renders the frames with Playwright, encodes VP9 WebM, writes the WAV and `voiceover.md` |
| `fix/` | The fixed `App.tsx`, `app.css` and `tsconfig.json` for the "fix, audit again" scene |
| `voiceover.md` | The timeline for the narrator: time, length, what is on screen, a suggested line in Polish and English |

## Build

Playwright and an ffmpeg with `libvpx-vp9` are needed; neither is a dependency of this repository. The ffmpeg that
Playwright downloads for its own video recording is enough and is found automatically.

```sh
PLAYWRIGHT_MODULE=/path/to/node_modules/playwright/index.mjs \
  node media/video/build.mjs --out /tmp/fs-video --format youtube,tiktok --lang en,pl
```

- `--stills 3,40,120` writes PNG frames at those seconds instead of videos (quick layout checks).
- `--live` records in real time with Playwright's own video recording instead of frame by frame (lower quality).
- `--voiceover` only rewrites `voiceover.md` from `timeline.mjs`.
- `FFMPEG=/path/to/ffmpeg` picks another encoder.

Output: `frontend-skills-<youtube-16x9|tiktok-9x16>-<en|pl>.webm` (30 fps, silent), `frontend-skills-soundtrack.wav`
(48 kHz stereo, as long as the video) and a copy of `voiceover.md`. Picture, effects and voice are put together in an
editor or with ffmpeg; the commands are in `voiceover.md`.
