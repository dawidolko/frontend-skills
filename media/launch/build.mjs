#!/usr/bin/env node
/*
 * Renders the launch thumbnails from thumbnail.html with Playwright: YouTube 1280x720 and LinkedIn 1200x627, each as
 * PNG and JPG, with the author's portrait, the mark, the headline and the counts read from the dictionary. The
 * portrait is passed as a path and is not stored in the repository; Playwright is not a dependency, its path comes from
 * PLAYWRIGHT_MODULE. Every file is checked to stay under 2 MB.
 * Usage: node media/launch/build.mjs --photo <portrait.png> [--out media/launch]
 */
import { mkdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { ADAPTERS } from '../../adapters/index.mjs'
import { loadRules, loadSkills } from '../../cli/lib/catalog.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const SIZES = [
  ['thumbnail-youtube', 1280, 720],
  ['thumbnail-linkedin', 1200, 627]
]
const LIMIT = 2 * 1024 * 1024

async function main(argv) {
  const opt = (name, fallback) => {
    const i = argv.indexOf(name)
    return i === -1 ? fallback : argv[i + 1]
  }
  const photo = opt('--photo', null)
  if (!photo) throw new Error('usage: node media/launch/build.mjs --photo <portrait.png> [--out dir]')
  const out = path.resolve(opt('--out', HERE))
  mkdirSync(out, { recursive: true })
  const mod = process.env.PLAYWRIGHT_MODULE
  if (!mod) throw new Error('set PLAYWRIGHT_MODULE to the path of an installed playwright/index.mjs')
  const { chromium } = await import(pathToFileURL(mod).href)
  const counts = { rules: loadRules().length, skills: loadSkills().length, agents: ADAPTERS.length }
  const browser = await chromium.launch()
  try {
    for (const [name, w, h] of SIZES) {
      const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })
      const q = new URLSearchParams({ w, h, photo: pathToFileURL(path.resolve(photo)).href, ...counts })
      await page.goto(`${pathToFileURL(path.join(HERE, 'thumbnail.html')).href}?${q}`)
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(300)
      const box = page.locator('#t')
      for (const [ext, extra] of [
        ['png', { type: 'png' }],
        ['jpg', { type: 'jpeg', quality: 90 }]
      ]) {
        const file = path.join(out, `${name}.${ext}`)
        await box.screenshot({ path: file, ...extra })
        const size = statSync(file).size
        if (size > LIMIT) throw new Error(`${file} is ${(size / 1024 / 1024).toFixed(2)} MB, over 2 MB`)
        process.stdout.write(`${path.relative(process.cwd(), file)}: ${w}x${h}, ${(size / 1024).toFixed(0)} KB\n`)
      }
      await page.close()
    }
  } finally {
    await browser.close()
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main(process.argv.slice(2))
