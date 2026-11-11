/*
 * Unit tests of the front matter reader, the markup scanner (HTML, JSX in TS, Vue, Svelte, Astro, Angular) and the
 * CSS scanner: the cases that decide whether a rule sees an element or a declaration at the right line.
 */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { FrontMatterError, parseFrontMatter, stringifyFrontMatter } from '../cli/lib/frontmatter.mjs'
import { fullSelector, parseCss } from '../engine/parse/css.mjs'
import { parseMarkup } from '../engine/parse/markup.mjs'

const names = (r) => r.elements.map((e) => `${e.line}:${e.name}`)

test('front matter: scalars, lists, maps, list of maps, CRLF and BOM', () => {
  const text =
    '﻿---\r\nname: fe-x\r\ndescription: "A: quoted"\r\nmetadata:\r\n  title: X\r\napplies:\r\n  - html\r\n  - jsx\r\nsources:\r\n  - title: A\r\n    url: https://a.example\r\n---\r\n# Body\r\n'
  const { data, body, bodyLine } = parseFrontMatter(text)
  assert.deepEqual(data, {
    name: 'fe-x',
    description: 'A: quoted',
    metadata: { title: 'X' },
    applies: ['html', 'jsx'],
    sources: [{ title: 'A', url: 'https://a.example' }]
  })
  assert.equal(body, '# Body\n')
  assert.equal(bodyLine, 13)
})

test('front matter: refuses what other YAML readers would read differently', () => {
  for (const bad of ['---\nname: a: b\n---\n', '---\nname: [a]\n---\n', '---\nname: a\nname: b\n---\n', '---\n\tname: a\n---\n', '---\nname: a\n'])
    assert.throws(() => parseFrontMatter(bad), FrontMatterError, bad)
})

test('front matter: stringify round-trips', () => {
  const data = { name: 'fe-x', description: 'Has: colon', tags: ['a', '-b'], metadata: { k: 'v' } }
  assert.deepEqual(parseFrontMatter(stringifyFrontMatter(data)).data, data)
})

test('jsx: comparisons, generics and regex are not tags; nested JSX in expressions is', () => {
  const src = [
    'const re = /<div>/g',
    'function f<T>(a: Array<T>) { return a.length < 2 }',
    'export const A = () => (',
    '  <ul className="x" {...rest}>',
    '    {items.map((i, n) => <li key={n} onClick={go}>{i > 1 ? <b /> : null}</li>)}',
    '  </ul>',
    ')'
  ].join('\n')
  const r = parseMarkup(src, 'jsx')
  assert.deepEqual(names(r), ['4:ul', '5:li', '5:b'])
  const [ul, li] = r.elements
  assert.equal(ul.spread, true)
  assert.equal(ul.attrs.get('class').value, 'x')
  assert.equal(li.attrs.get('onclick').event, true)
  assert.equal(li.attrs.get('key').dynamic, true)
  assert.deepEqual(r.elements[2].ancestors, ['ul', 'li'])
})

test('jsx: components keep their name and are flagged', () => {
  const r = parseMarkup('const a = <Image src={x} /> ; const b = <Foo.Bar />', 'jsx')
  assert.deepEqual(
    r.elements.map((e) => [e.name, e.component]),
    [
      ['Image', true],
      ['Foo.Bar', true]
    ]
  )
})

test('vue: only the template block, bindings and events normalised, styles collected', () => {
  const src =
    '<script setup>\nconst a = 1 < 2\n</script>\n<template>\n  <img :src="u" @click="go" v-bind="attrs">\n  <p>{{ a<b }}</p>\n</template>\n<style lang="scss">\n.a { color: red }\n</style>\n'
  const r = parseMarkup(src, 'vue')
  assert.deepEqual(names(r), ['5:img', '6:p'])
  assert.equal(r.elements[0].attrs.get('src').dynamic, true)
  assert.equal(r.elements[0].attrs.get('onclick').event, true)
  assert.equal(r.elements[0].spread, true)
  assert.equal(r.styles[0].lang, 'scss')
})

test('svelte, astro and angular attribute forms', () => {
  const s = parseMarkup('<button on:click={go} {disabled} {...rest}>x</button>', 'svelte').elements[0]
  assert.equal(s.attrs.get('onclick').event, true)
  assert.equal(s.attrs.get('disabled').dynamic, true)
  assert.equal(s.spread, true)
  const a = parseMarkup('---\nconst x = 1 < 2\n---\n<ul>{list.map((i) => <li>{i}</li>)}</ul>', 'astro')
  assert.deepEqual(names(a), ['4:ul', '4:li'])
  const g = parseMarkup('<img [src]="u" [attr.alt]="t" (click)="go()">', 'angular').elements[0]
  assert.equal(g.attrs.get('alt').dynamic, true)
  assert.equal(g.attrs.get('onclick').event, true)
})

test('html: comments, raw text, implied end tags, doctype and line numbers', () => {
  const r = parseMarkup('<!doctype html>\n<!-- <img> -->\n<script>if (a < b) {}</script>\n<ul><li>a<li>b</ul>\n<textarea><p></textarea>', 'html')
  assert.equal(r.doctype, true)
  assert.deepEqual(names(r), ['3:script', '4:ul', '4:li', '4:li', '5:textarea'])
  assert.deepEqual(r.elements[3].ancestors, ['ul'])
})

test('css: nesting, comments, strings, SCSS comments and interpolation', () => {
  const css =
    '/* a { b: c } */\n.a {\n  content: "}";\n  &:focus { outline: none; }\n  #{$x}: 1;\n}\n// .b { c: d }\n@media (min-width: 1px) { .c { height: 100vh !important } }\n'
  const { blocks } = parseCss(css, { scss: true })
  assert.deepEqual(
    blocks.map((b) => [b.line, b.prelude]),
    [
      [2, '.a'],
      [4, '&:focus'],
      [8, '@media (min-width: 1px)'],
      [8, '.c']
    ]
  )
  assert.equal(fullSelector(blocks[1]), '.a:focus')
  assert.deepEqual(blocks[3].decls[0], { prop: 'height', value: '100vh', important: true, line: 8 })
})
