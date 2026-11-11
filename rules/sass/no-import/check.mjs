/*
 * sass/no-import: reports Sass @import rules in SCSS files and scss style blocks. An @import whose every URL is a
 * plain CSS import (url(...), a .css file, an http(s) URL, or followed by a media query) is left out, and so is
 * @import "tailwindcss", which tailwind/no-preprocessor reports.
 */
import { findInScss } from '../scss.mjs'

function isPlainCss(part) {
  const p = part.trim()
  if (/^url\(/i.test(p)) return true
  const m = /^(["'])(.*?)\1\s*(.*)$/.exec(p)
  if (!m) return true
  return /\.css$/i.test(m[2]) || /^https?:\/\//i.test(m[2]) || m[2] === 'tailwindcss' || m[3].trim() !== ''
}

export default {
  check(ctx) {
    for (const f of findInScss(ctx, /@import\s+([^;{}]+)/g)) {
      const parts = f.match[1].split(/,(?=\s*["']|\s*url\()/)
      if (parts.every(isPlainCss)) continue
      ctx.report(ctx.lineOf(f.index), '@import is deprecated in Sass; load the file with @use (or @forward to re-export).')
    }
  }
}
