/*
 * The Open Graph image of the site: an SVG drawn here (1200 × 630, the author's dark look and purple accent) and its
 * PNG, rendered by a headless Chrome when one is found (CHROME_PATH, else the usual install paths). Without Chrome the
 * build copies the PNG committed in site/og/, which this renderer produced, so a build never needs a browser.
 */
import { spawnSync } from 'node:child_process'
import { copyFileSync, cpSync, existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { esc } from './markdown.mjs'

/* Splits a line of text into lines of at most `max` characters, on spaces. */
function wrap(text, max) {
  const lines = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    if (line && (line + ' ' + word).length > max) {
      lines.push(line)
      line = word
    } else line = line ? `${line} ${word}` : word
  }
  if (line) lines.push(line)
  return lines
}

export function ogSvg(t, data) {
  const tagline = wrap(t('site.tagline'), 44).slice(0, 3)
  const facts = `skills.dawidolko.pl  ·  MIT  ·  ${data.rules.length} ${t.plural('rules', data.rules.length)}  ·  ${data.agents.length} ${t.plural('agents', data.agents.length)}`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<style>
@font-face { font-family: "Open Sans"; font-weight: 300 700; src: url(fonts/opensans-latin.woff2) format("woff2"); unicode-range: U+0000-00FF, U+2000-206F; }
@font-face { font-family: "Open Sans"; font-weight: 300 700; src: url(fonts/opensans-latin-ext.woff2) format("woff2"); unicode-range: U+0100-02FF; }
text { font-family: "Open Sans", Arial, sans-serif; }
.mono { font-family: Menlo, Consolas, monospace; }
</style>
<defs>
<radialGradient id="glow" cx="0.9" cy="0" r="0.8"><stop offset="0" stop-color="#a800d1" stop-opacity="0.55"/><stop offset="1" stop-color="#a800d1" stop-opacity="0"/></radialGradient>
<radialGradient id="glow2" cx="0" cy="1" r="0.6"><stop offset="0" stop-color="#a800d1" stop-opacity="0.25"/><stop offset="1" stop-color="#a800d1" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1200" height="630" fill="#0d0d0f"/>
<rect width="1200" height="630" fill="url(#glow)"/>
<rect width="1200" height="630" fill="url(#glow2)"/>
<g transform="translate(80 78)">
<rect width="76" height="76" rx="18" fill="#d264f5"/>
<path d="M30 24 17 38l13 14M46 24l13 14-13 14" fill="none" stroke="#0d0d0f" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
<text x="104" y="54" font-size="52" font-weight="700" fill="#f0f0f0">Frontend Skills</text>
</g>
${tagline.map((l, i) => `<text x="80" y="${250 + i * 54}" font-size="42" font-weight="600" fill="#f0f0f0">${esc(l)}</text>`).join('\n')}
<g transform="translate(80 ${250 + tagline.length * 54 + 14})">
<rect width="1040" height="78" rx="14" fill="#16151a" stroke="#3a3442" stroke-width="2"/>
<text x="30" y="50" class="mono" font-size="30" fill="#f0f0f0"><tspan fill="#d264f5" font-weight="700">$ </tspan>npx github:dawidolko/frontend-skills init</text>
</g>
<text x="80" y="574" font-size="26" font-weight="600" fill="#d264f5">${esc(facts)}</text>
</svg>
`
}

function chromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  ].filter(Boolean)
  return candidates.find((p) => existsSync(p)) || null
}

/**
 * Writes og-<lang>.svg and og-<lang>.png into out. fontsDir holds the woff2 files the SVG uses. Returns how the PNG
 * was made: "chrome", "fallback" or "missing".
 */
export function writeOg(out, lang, svg, fontsDir, fallbackDir) {
  const svgFile = path.join(out, `og-${lang}.svg`)
  const pngFile = path.join(out, `og-${lang}.png`)
  writeFileSync(svgFile, svg)
  const chrome = chromePath()
  if (chrome) {
    const work = mkdtempSync(path.join(tmpdir(), 'fs-og-'))
    try {
      const page = path.join(work, 'og.svg')
      writeFileSync(page, svg)
      cpSync(fontsDir, path.join(work, 'fonts'), { recursive: true })
      const shot = path.join(work, 'og.png')
      spawnSync(
        chrome,
        [
          '--headless=new',
          '--disable-gpu',
          '--hide-scrollbars',
          '--no-first-run',
          '--no-default-browser-check',
          '--force-device-scale-factor=1',
          '--window-size=1200,630',
          `--user-data-dir=${path.join(work, 'profile')}`,
          '--virtual-time-budget=3000',
          `--screenshot=${shot}`,
          pathToFileURL(page).href
        ],
        { stdio: 'ignore', timeout: 60000 }
      )
      if (existsSync(shot)) {
        copyFileSync(shot, pngFile)
        return 'chrome'
      }
    } finally {
      rmSync(work, { recursive: true, force: true })
    }
  }
  const fallback = path.join(fallbackDir, `og-${lang}.png`)
  if (existsSync(fallback)) {
    copyFileSync(fallback, pngFile)
    return 'fallback'
  }
  return 'missing'
}
