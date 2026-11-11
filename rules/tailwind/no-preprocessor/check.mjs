/*
 * tailwind/no-preprocessor: a project check. For every package.json that declares tailwindcss 4 or newer, it
 * reports a Sass, Less or Stylus dependency (at its line in package.json) and an @import "tailwindcss" or @tailwind
 * line inside a .scss or .less file of that package.
 */
import { hasDep, lineOfMatch, majorOf, packages } from '../tw.mjs'

const PREPROCESSORS = ['sass', 'sass-embedded', 'node-sass', 'less', 'stylus']

export default {
  check(ctx) {
    for (const p of packages(ctx)) {
      if ((majorOf(p.pkg, 'tailwindcss') ?? 0) < 4) continue
      for (const name of PREPROCESSORS)
        if (hasDep(p.pkg, name))
          ctx.report({ file: p.path, line: lineOfMatch(p.text, new RegExp(`"${name}"\\s*:`)) }, `Tailwind 4 is not designed to run with ${name}; move the styles to plain CSS.`)
      for (const f of p.files.filter((x) => x.kind === 'scss' || x.kind === 'less')) {
        ctx.read(f.path).split('\n').forEach((line, i) => {
          if (/^\s*@(?:import\s+["']tailwindcss["']|tailwind\s)/.test(line)) ctx.report({ file: f.path, line: i + 1 }, `Tailwind is loaded from a .${f.kind} file; make the entry a .css file.`)
        })
      }
    }
  }
}
