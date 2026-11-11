/*
 * Synthesises the video's sound track: light transition and interface sounds (soft whooshes, clicks, pops, ticks, a
 * chime and an opening riser) placed at the cue times of timeline.mjs, written as a 48 kHz 16-bit stereo WAV that is
 * exactly as long as the video. Every sound is generated here from sine waves and seeded noise, so the track is the
 * same on every build and nothing is downloaded. The loudest moment peaks at -10 dBFS so a voice recorded on top
 * stays clear. Usage: node media/video/audio.mjs <out.wav>
 */
import { writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { CUES, TOTAL } from './timeline.mjs'

export const RATE = 48000
const TAU = Math.PI * 2

function noise(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return (((t ^ (t >>> 14)) >>> 0) / 4294967296) * 2 - 1
  }
}

/** A band-pass state-variable filter whose centre frequency may change per sample. */
function bandpass(q = 1.4) {
  let low = 0
  let band = 0
  return (x, freq) => {
    const f = 2 * Math.sin((Math.PI * Math.min(freq, RATE / 6)) / RATE)
    low += f * band
    const high = x - low - band / q
    band += f * high
    return band
  }
}

/** Each sound returns [left, right] sample arrays. */
const SOUNDS = {
  whoosh(seed) {
    const n = Math.round(RATE * 0.75)
    const rnd = noise(seed)
    const bp = bandpass(1.1)
    const l = new Float32Array(n)
    const r = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      const p = i / n
      const env = Math.sin(Math.PI * p) ** 2
      const freq = 350 + 2600 * Math.sin(Math.PI * p ** 0.8)
      const v = bp(rnd(), freq) * env * 0.9
      const pan = 0.2 + 0.6 * p
      l[i] = v * Math.cos((pan * Math.PI) / 2)
      r[i] = v * Math.sin((pan * Math.PI) / 2)
    }
    return [l, r]
  },
  click(seed) {
    const n = Math.round(RATE * 0.09)
    const rnd = noise(seed)
    const out = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      const s = i / RATE
      const body = Math.sin(TAU * 1700 * s) * Math.exp(-s / 0.012) * 0.6
      const thump = Math.sin(TAU * 140 * s) * Math.exp(-s / 0.02) * 0.5
      const snap = s < 0.004 ? rnd() * (1 - s / 0.004) * 0.5 : 0
      out[i] = body + thump + snap
    }
    return [out, out]
  },
  pop() {
    const n = Math.round(RATE * 0.22)
    const out = new Float32Array(n)
    let phase = 0
    for (let i = 0; i < n; i++) {
      const s = i / RATE
      const freq = 520 + 380 * Math.min(1, s / 0.06)
      phase += (TAU * freq) / RATE
      const env = Math.min(1, s / 0.004) * Math.exp(-s / 0.07)
      out[i] = (Math.sin(phase) + 0.25 * Math.sin(2 * phase)) * env * 0.7
    }
    return [out, out]
  },
  tick() {
    const n = Math.round(RATE * 0.06)
    const out = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      const s = i / RATE
      out[i] = Math.sin(TAU * 2600 * s) * Math.min(1, s / 0.002) * Math.exp(-s / 0.012) * 0.5
    }
    return [out, out]
  },
  chime() {
    const n = Math.round(RATE * 2.0)
    const l = new Float32Array(n)
    const r = new Float32Array(n)
    const notes = [
      [1046.5, 0, 0.35],
      [1318.5, 0.09, 0.65],
      [1568.0, 0.18, 0.5]
    ]
    for (const [freq, at, pan] of notes) {
      const from = Math.round(at * RATE)
      for (let i = from; i < n; i++) {
        const s = (i - from) / RATE
        const env = Math.min(1, s / 0.005) * Math.exp(-s / 0.45)
        const v = (Math.sin(TAU * freq * s) + 0.18 * Math.sin(TAU * freq * 2.76 * s) * Math.exp(-s / 0.15)) * env * 0.33
        l[i] += v * Math.cos((pan * Math.PI) / 2)
        r[i] += v * Math.sin((pan * Math.PI) / 2)
      }
    }
    return [l, r]
  },
  riser(seed) {
    const n = Math.round(RATE * 1.1)
    const rnd = noise(seed)
    const bp = bandpass(0.9)
    const l = new Float32Array(n)
    const r = new Float32Array(n)
    let phase = 0
    for (let i = 0; i < n; i++) {
      const p = i / n
      const env = p ** 1.6 * (p > 0.92 ? (1 - p) / 0.08 : 1)
      phase += (TAU * (220 + 220 * p)) / RATE
      const v = (bp(rnd(), 400 + 3600 * p) * 0.8 + Math.sin(phase) * 0.25) * env
      l[i] = v * 0.9
      r[i] = v
    }
    return [l, r]
  }
}

/** Mixes every cue into one stereo buffer of the video's length; returns { left, right }. */
export function mix(cues = CUES, seconds = TOTAL) {
  const n = Math.round(seconds * RATE)
  const left = new Float32Array(n)
  const right = new Float32Array(n)
  cues.forEach((cue, k) => {
    const [l, r] = SOUNDS[cue.kind](1000 + k * 7919)
    const from = Math.round(Math.max(0, cue.t) * RATE)
    for (let i = 0; i < l.length && from + i < n; i++) {
      left[from + i] += l[i] * cue.gain
      right[from + i] += r[i] * cue.gain
    }
  })
  let peak = 0
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]))
  const scale = peak ? 10 ** (-10 / 20) / peak : 1
  for (let i = 0; i < n; i++) {
    left[i] *= scale
    right[i] *= scale
  }
  return { left, right }
}

/** Encodes a stereo buffer as a 16-bit PCM WAV file. */
export function wav({ left, right }) {
  const n = left.length
  const buf = Buffer.alloc(44 + n * 4)
  buf.write('RIFF', 0)
  buf.writeUInt32LE(36 + n * 4, 4)
  buf.write('WAVEfmt ', 8)
  buf.writeUInt32LE(16, 16)
  buf.writeUInt16LE(1, 20)
  buf.writeUInt16LE(2, 22)
  buf.writeUInt32LE(RATE, 24)
  buf.writeUInt32LE(RATE * 4, 28)
  buf.writeUInt16LE(4, 32)
  buf.writeUInt16LE(16, 34)
  buf.write('data', 36)
  buf.writeUInt32LE(n * 4, 40)
  const clip = (v) => Math.max(-32768, Math.min(32767, Math.round(v * 32767)))
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(clip(left[i]), 44 + i * 4)
    buf.writeInt16LE(clip(right[i]), 46 + i * 4)
  }
  return buf
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const out = process.argv[2]
  if (!out) throw new Error('usage: node media/video/audio.mjs <out.wav>')
  writeFileSync(out, wav(mix()))
  process.stdout.write(`${out}: ${TOTAL} s, ${CUES.length} cues\n`)
}
