/*
 * tailwind/v4-entry: a project check. For every package.json that declares tailwindcss 4 or newer, it reports
 * @tailwind directives in that package's CSS files, and a tailwind.config.(js|cjs|mjs|ts) in the package folder
 * that no CSS file loads with @config. Packages on Tailwind 3 are left alone.
 */
import { lineOfMatch, majorOf, packages } from '../tw.mjs'

const STYLES = new Set(['css', 'scss', 'less'])
const DIRECTIVE = /^\s*@tailwind\s+(base|components|utilities|variants|screens)\b/

export default {
  check(ctx) {
    for (const p of packages(ctx)) {
      if ((majorOf(p.pkg, 'tailwindcss') ?? 0) < 4) continue
      let config = false
      for (const f of p.files.filter((x) => STYLES.has(x.kind))) {
        const text = ctx.read(f.path)
        if (/@config\s/.test(text)) config = true
        text.split('\n').forEach((line, i) => {
          if (DIRECTIVE.test(line))
            ctx.report({ file: f.path, line: i + 1 }, `@tailwind ${DIRECTIVE.exec(line)[1]} does nothing in Tailwind 4; use @import "tailwindcss".`)
        })
      }
      if (config) continue
      for (const ext of ['js', 'cjs', 'mjs', 'ts']) {
        const file = p.dir ? `${p.dir}/tailwind.config.${ext}` : `tailwind.config.${ext}`
        const text = ctx.read(file)
        if (text)
          ctx.report(
            { file, line: lineOfMatch(text, /module\.exports|export default/) },
            `Tailwind 4 does not load ${file} by itself; add @config to the CSS entry or move the theme into @theme.`
          )
      }
    }
  }
}
