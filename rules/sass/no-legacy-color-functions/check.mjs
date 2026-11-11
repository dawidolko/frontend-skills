/*
 * sass/no-legacy-color-functions: reports the colour functions Dart Sass deprecated in 1.79.0 (darken, lighten,
 * adjust-hue, desaturate, opacify, fade-in, transparentize, fade-out, saturate with two arguments) and the
 * single-channel getters (red, green, blue, hue, saturation, lightness, whiteness, blackness, global or color.*).
 * CSS's own saturate() filter (one argument) and names the file defines itself are left out.
 */
import { closing } from '../../js/source.mjs'
import { findInScss } from '../scss.mjs'

const ADJUST = /(?<![\w.$%@-])(darken|lighten|adjust-hue|desaturate|opacify|fade-in|transparentize|fade-out|saturate)\s*\(/g
const GETTER = /(?<![\w$%@-])((?:color\.)?(?:red|green|blue|hue|saturation|lightness|whiteness|blackness))\s*\(/g

export default {
  check(ctx) {
    const own = new Set()
    for (const f of findInScss(ctx, /@function\s+([\w-]+)/g)) own.add(f.match[1])
    for (const f of findInScss(ctx, ADJUST, { strings: true })) {
      const name = f.match[1]
      if (own.has(name)) continue
      const open = f.at + f.match[0].length - 1
      const end = closing(f.code, open)
      if (name === 'saturate' && (end < 0 || !/,/.test(f.code.slice(open, end)))) continue
      ctx.report(ctx.lineOf(f.index), `${name}() is deprecated; use color.scale() or color.adjust() from sass:color.`)
    }
    for (const f of findInScss(ctx, GETTER, { strings: true })) {
      const name = f.match[1]
      if (own.has(name) || (!name.startsWith('color.') && !/\$/.test(f.code.slice(f.at, f.at + 60).split(')')[0]))) continue
      ctx.report(ctx.lineOf(f.index), `${name}() is deprecated; use color.channel($color, '${name.replace('color.', '')}', $space: ...).`)
    }
  }
}
