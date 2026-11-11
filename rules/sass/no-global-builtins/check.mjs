/*
 * sass/no-global-builtins: reports calls of deprecated global Sass built-in functions (map-get, nth, unit,
 * str-index, percentage...) and names the module function to use. Names that are also CSS functions (min, max,
 * round, abs, saturate, invert, grayscale...) are left out, and so are the old colour functions, which
 * sass/no-legacy-color-functions reports, any name the file defines itself, and custom property values, which Sass
 * does not evaluate.
 */
import { findInScss, functionRanges } from '../scss.mjs'

const TARGET = new Map(
  Object.entries({
    'map-get': 'map.get',
    'map-merge': 'map.merge',
    'map-remove': 'map.remove',
    'map-keys': 'map.keys',
    'map-values': 'map.values',
    'map-has-key': 'map.has-key',
    nth: 'list.nth',
    'set-nth': 'list.set-nth',
    length: 'list.length',
    join: 'list.join',
    append: 'list.append',
    zip: 'list.zip',
    index: 'list.index',
    'list-separator': 'list.separator',
    'is-bracketed': 'list.is-bracketed',
    'str-length': 'string.length',
    'str-index': 'string.index',
    'str-insert': 'string.insert',
    'str-slice': 'string.slice',
    'to-upper-case': 'string.to-upper-case',
    'to-lower-case': 'string.to-lower-case',
    'unique-id': 'string.unique-id',
    quote: 'string.quote',
    unquote: 'string.unquote',
    percentage: 'math.percentage',
    unit: 'math.unit',
    unitless: 'math.is-unitless',
    comparable: 'math.compatible',
    ceil: 'math.ceil',
    floor: 'math.floor',
    'type-of': 'meta.type-of',
    inspect: 'meta.inspect',
    'variable-exists': 'meta.variable-exists',
    'global-variable-exists': 'meta.global-variable-exists',
    'function-exists': 'meta.function-exists',
    'mixin-exists': 'meta.mixin-exists',
    'feature-exists': 'meta.feature-exists',
    'content-exists': 'meta.content-exists',
    'get-function': 'meta.get-function',
    call: 'meta.call',
    keywords: 'meta.keywords',
    'selector-nest': 'selector.nest',
    'selector-append': 'selector.append',
    'selector-extend': 'selector.extend',
    'selector-replace': 'selector.replace',
    'selector-unify': 'selector.unify',
    'is-superselector': 'selector.is-superselector',
    'simple-selectors': 'selector.simple-selectors',
    'selector-parse': 'selector.parse',
    mix: 'color.mix',
    'adjust-color': 'color.adjust',
    'scale-color': 'color.scale',
    'change-color': 'color.change',
    complement: 'color.complement',
    'ie-hex-str': 'color.ie-hex-str'
  })
)

const NAMES = [...TARGET.keys()].sort((a, b) => b.length - a.length)
const CALL = new RegExp(`(?<![\\w.$%@-])(${NAMES.join('|')})\\s*\\(`, 'g')

export default {
  check(ctx) {
    const own = new Set()
    for (const f of findInScss(ctx, /@(?:function|mixin)\s+([\w-]+)/g)) own.add(f.match[1])
    for (const f of findInScss(ctx, CALL, { strings: true })) {
      const name = f.match[1]
      if (own.has(name)) continue
      if (functionRanges(f.code).some((r) => r.name === name && f.at >= r.start && f.at < r.end)) continue
      const statement = f.code.slice(0, f.at).split(/[;{}]/).pop()
      if (/^\s*--/.test(statement)) continue
      const target = TARGET.get(name)
      ctx.report(ctx.lineOf(f.index), `${name}() is a deprecated global; @use 'sass:${target.split('.')[0]}' and call ${target}().`)
    }
  }
}
