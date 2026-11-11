# The Frontend Skills video

A 2:30 video that shows the tool, with light transition sounds already mixed in and gaps left for a voice-over, in two
layouts: YouTube 16:9 (1920×1080) and TikTok or Reels 9:16 (1080×1920), each in English and Polish, H.264 and AAC at
30 fps, with the Frontend Skills mark as a watermark (70 % opacity, top right on YouTube, top left below the app's own
bar on TikTok).

Everything on screen comes from real runs: the build copies the fixture projects, runs `init`, `audit` and `explain`,
installs for four agents, audits a project with its own Sass and icon helpers, applies the fixes in `fix/` and audits
again, builds the site and screenshots its dictionary. Nothing is typed in by hand except the words in `timeline.mjs`,
and the build stops when the numbers the narration says no longer match the recording.

| File | What it is |
| --- | --- |
| `timeline.mjs` | Scene lengths, the moments inside each scene, sound cues, narration slots (Polish and English), on-screen text |
| `index.html`, `scenes.css`, `player.mjs` | The stage: every frame is a function of its time, so frames are the same on every build |
| `audio.mjs` | The sound track, synthesised (whooshes, clicks, pops, ticks, chimes, a riser); no downloaded sounds |
| `encode.swift` | Writes the MP4 with AVFoundation: frames from standard input to H.264, the WAV to AAC; `--inspect` checks a file |
| `build.mjs` | Records the data, renders the frames with Playwright, streams them to the encoder, inspects the result |
| `fix/` | The fixed `App.tsx`, `app.css`, `index.html` and `tsconfig.json` for the "fix, audit again" scene |
| `voiceover.md` | The timeline for the narrator: time, length, what is on screen, a suggested line in Polish and English |

## Build

macOS with the command line tools (`swiftc`, AVFoundation) and an installed Playwright; neither is a dependency of
this repository and nothing is installed. Frames are streamed from the browser to the encoder, so none is written to
disk; the build stops when less than 2 GB is free.

```sh
PLAYWRIGHT_MODULE=/path/to/node_modules/playwright/index.mjs \
  node media/video/build.mjs --out /tmp/fs-video --format youtube,tiktok --lang en,pl
```

- `--stills 3,40,120` writes PNG frames at those seconds instead of videos (quick layout checks).
- `--seconds 10` encodes only the first seconds (quick encoder checks).
- `--live` records in real time with Playwright's own video recording instead (WebM, no sound, lower quality).
- `--voiceover` only rewrites `voiceover.md` from `timeline.mjs`.

Output: `frontend-skills-<youtube-16x9|tiktok-9x16>-<en|pl>.mp4`, a few frames of each for checking,
`frontend-skills-soundtrack.wav` (the effects alone, 48 kHz stereo) and a copy of `voiceover.md`, which also says how
to add the voice.
