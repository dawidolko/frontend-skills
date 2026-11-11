/*
 * Stack detection, project helpers, profile building, lessons and the marked blocks, on the fixture projects.
 */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ADAPTERS } from '../adapters/index.mjs'
import { readBlock, removeBlock, upsertBlock } from '../cli/lib/blocks.mjs'
import { loadSkills } from '../cli/lib/catalog.mjs'
import { detectHelpers, fillHelpers, helperLines, mergeHelpers } from '../cli/lib/conventions.mjs'
import { cleanVersion, detectAgents, detectStack } from '../cli/lib/detect.mjs'
import { addLesson, lessonProblem, matchSkills, readLessons } from '../cli/lib/profile.mjs'
import { copyFixture } from './helpers.mjs'

test('cleanVersion', () => {
  assert.equal(cleanVersion('^19.3.1'), '19.3.1')
  assert.equal(cleanVersion('~7.0'), '7.0.0')
  assert.equal(cleanVersion('workspace:*'), null)
  assert.equal(cleanVersion('github:a/b'), null)
})

test('React + Vite project', () => {
  const root = copyFixture('react-vite')
  const d = detectStack(root)
  assert.equal(d.packageManager, 'pnpm')
  assert.equal(d.projects[0].frameworks.react, '19.3.1')
  for (const k of ['web', 'react', 'typescript', 'tailwind', 'vite', 'vitest', 'testing-library', 'tanstack-query']) assert.ok(d.stack.includes(k), k)
  assert.deepEqual(detectAgents(root, ADAPTERS).sort(), ['claude', 'cursor'])
  assert.deepEqual(
    matchSkills(loadSkills(), d.stack).map((s) => s.name),
    ['fe-a11y-forms', 'fe-html', 'fe-react']
  )
})

test('plain HTML site with no package.json, in a folder named with spaces', () => {
  const root = copyFixture('plain html site')
  const d = detectStack(root)
  assert.equal(d.projects[0].plainHtml, true)
  assert.deepEqual(d.stack, ['web', 'html'])
  assert.equal(d.packageManager, null)
  assert.deepEqual(
    matchSkills(loadSkills(), d.stack).map((s) => s.name),
    ['fe-a11y-forms', 'fe-html']
  )
})

test('pnpm monorepo with Next.js, Astro and Lit packages', () => {
  const root = copyFixture('monorepo')
  const d = detectStack(root)
  assert.deepEqual(d.monorepo, { tool: 'pnpm', packages: ['apps/docs', 'apps/web', 'packages/ui'] })
  assert.deepEqual(
    d.projects.map((p) => p.path),
    ['apps/docs', 'apps/web', 'packages/ui']
  )
  assert.equal(d.projects[1].frameworks.next, '16.4.6')
  for (const k of ['next', 'react', 'astro', 'lit', 'playwright', 'i18n']) assert.ok(d.stack.includes(k), k)
  assert.deepEqual(detectAgents(root, ADAPTERS).sort(), ['gemini', 'kiro'])
})

test('project helpers: rem-calc, icon font, tokens, custom properties', () => {
  const root = copyFixture('scss-helpers')
  const h = detectHelpers(root)
  assert.equal(h['rem-function'].name, 'rem-calc')
  assert.equal(h['rem-function'].file, 'src/styles/_functions.scss')
  assert.equal(h['rem-function'].line, 3)
  assert.deepEqual([h['icon-classes'].tool, h['icon-classes'].prefix, h['icon-classes'].sourceDir], ['fantasticon', 'ico-', 'src/icons'])
  assert.equal(h['design-tokens'].tool, 'style-dictionary')
  assert.deepEqual(h['design-tokens'].files, ['tokens/color.tokens.json'])
  assert.equal(h['custom-properties'].count, 5)
  assert.equal(detectHelpers(copyFixture('react-vite'))['rem-function'], undefined)
  const lines = helperLines(h).join('\n')
  assert.match(lines, /rem-calc\(\)/)
  assert.match(lines, /ico-<name>/)
})

test('helpers a person added survive detection; placeholders fill with fallbacks', () => {
  const merged = mergeHelpers(
    { 'custom-properties': { count: 9 } },
    { 'rem-function': { name: 'to-rem', source: 'person' }, 'icon-sprite': { tool: 'x', source: 'detected' } }
  )
  assert.equal(merged['rem-function'].name, 'to-rem')
  assert.equal(merged['icon-sprite'], undefined)
  assert.equal(fillHelpers('Use {{rem-function.name|your helper}}.', merged), 'Use to-rem.')
  assert.equal(fillHelpers('Use {{rem-function.name|your helper}}.', {}), 'Use your helper.')
})

test('lessons: one line, no secrets, no duplicates', () => {
  const root = copyFixture('react-vite')
  assert.match(lessonProblem('a\nb', 'convention'), /one line/)
  assert.match(lessonProblem('token = ghp_abcdefghijklmnopqrstuvwxyz0123', 'pitfall'), /secret/)
  assert.match(lessonProblem('x', 'opinion'), /kind/)
  assert.deepEqual(addLesson(root, { text: 'Forms use components/Field.tsx.', kind: 'convention', today: '2026-11-11' }), { added: true })
  assert.deepEqual(addLesson(root, { text: 'forms use components/field.tsx.', kind: 'convention', today: '2026-11-11' }), { added: false })
  assert.deepEqual(readLessons(root), [{ date: '2026-11-11', kind: 'convention', text: 'Forms use components/Field.tsx.' }])
})

test('marked blocks: insert, replace, remove leave the rest byte for byte', () => {
  for (const t of ['', 'A', 'A\n', 'A\n\n', '# T\r\n\r\nText\r\n']) {
    const once = upsertBlock(t, 'one')
    const twice = upsertBlock(once, 'two')
    assert.equal(readBlock(twice), 'two')
    assert.equal(twice.split('frontend-skills:start').length, 2)
    assert.equal(removeBlock(twice), t)
    if (t.includes('\r\n')) assert.ok(!/[^\r]\n/.test(twice), 'CRLF kept')
  }
})
