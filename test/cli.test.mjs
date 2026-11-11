/*
 * End-to-end tests of the command on copies of the fixture projects (in folders whose paths contain spaces): init
 * with detected and chosen agents, the safety rules (no overwrite of a person's file, changed files kept, exact
 * uninstall), dry runs, non-interactive refusals, audit outputs and exit codes, --changed in git, suppression,
 * learn and lessons, explain and doctor.
 */
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { copyFixture, run, snapshot } from './helpers.mjs'

const outputs = (r) => r === '.frontend-skills' || r.startsWith('.frontend-skills/') || r === 'frontend-report.md'

test('init on a React project: Claude Code and Cursor, person files intact, exact uninstall', () => {
  const root = copyFixture('react-vite')
  const before = snapshot(root)
  const r = run(['init', '--cwd', root, '--yes'])
  assert.equal(r.code, 0, r.stderr)
  assert.match(r.stdout, /Coding agents found in this project: claude, cursor/)
  assert.ok(existsSync(path.join(root, '.claude/skills/fe-react/SKILL.md')))
  assert.ok(existsSync(path.join(root, '.cursor/rules/fe-react.mdc')))
  assert.ok(!existsSync(path.join(root, '.agents/skills')), 'Cursor reads .claude/skills: no second copy')
  assert.equal(readFileSync(path.join(root, '.cursor/rules/team.mdc'), 'utf8'), before['.cursor/rules/team.mdc'])
  assert.ok(readFileSync(path.join(root, 'CLAUDE.md'), 'utf8').startsWith(before['CLAUDE.md']))
  const profile = JSON.parse(readFileSync(path.join(root, '.frontend-skills/profile.json'), 'utf8'))
  assert.deepEqual(profile.skills, [
    'fe-a11y-aria',
    'fe-a11y-carousel-toast',
    'fe-a11y-combobox',
    'fe-a11y-core',
    'fe-a11y-dialog',
    'fe-a11y-forms',
    'fe-a11y-keyboard',
    'fe-a11y-media',
    'fe-a11y-menus',
    'fe-a11y-tables',
    'fe-a11y-tabs-accordion',
    'fe-a11y-visual',
    'fe-audit',
    'fe-component',
    'fe-core-web-vitals',
    'fe-css-architecture',
    'fe-css-layout',
    'fe-css-modern',
    'fe-data-fetching',
    'fe-fix',
    'fe-fonts',
    'fe-forms',
    'fe-html',
    'fe-i18n',
    'fe-icons',
    'fe-images',
    'fe-javascript',
    'fe-learn',
    'fe-lighthouse',
    'fe-motion',
    'fe-perf-delivery',
    'fe-react',
    'fe-responsive',
    'fe-review',
    'fe-security',
    'fe-seo-metadata',
    'fe-state',
    'fe-tailwind',
    'fe-testing',
    'fe-tooling',
    'fe-typescript'
  ])
  assert.match(readFileSync(path.join(root, 'frontend-report.md'), 'utf8'), /a11y\/img-alt/)
  assert.equal(run(['doctor', '--cwd', root]).code, 0)
  const second = run(['init', '--cwd', root, '--yes', '--no-audit'])
  assert.match(second.stdout, /Written 0, updated 0/)
  const u = run(['uninstall', '--cwd', root, '--yes'])
  assert.equal(u.code, 0, u.stderr)
  assert.deepEqual(snapshot(root, outputs), before)
})

test('a file the person wrote is never overwritten; a changed file is kept on update and uninstall', () => {
  const root = copyFixture('react-vite')
  writeFileSync(path.join(root, 'mine.txt'), 'x')
  mkdirSync(path.join(root, '.claude/rules'), { recursive: true })
  writeFileSync(path.join(root, '.claude/rules/fe-html.md'), 'my own rule\n')
  const r = run(['init', '--cwd', root, '--yes', '--no-audit'])
  assert.match(r.stdout, /not written 1 \(your files\)/)
  assert.equal(readFileSync(path.join(root, '.claude/rules/fe-html.md'), 'utf8'), 'my own rule\n')
  writeFileSync(path.join(root, '.claude/skills/fe-react/SKILL.md'), 'edited by me\n')
  const up = run(['update', '--cwd', root])
  assert.match(up.stdout, /kept 1 \(changed by you\)/)
  run(['uninstall', '--cwd', root, '--yes'])
  assert.equal(readFileSync(path.join(root, '.claude/skills/fe-react/SKILL.md'), 'utf8'), 'edited by me\n')
  assert.equal(readFileSync(path.join(root, '.claude/rules/fe-html.md'), 'utf8'), 'my own rule\n')
})

test('dry run writes nothing; no terminal and no --yes refuses; unknown agents are a usage error', () => {
  const root = copyFixture('plain html site')
  const before = snapshot(root)
  assert.equal(run(['init', '--cwd', root, '--agents', 'codex', '--dry-run']).code, 0)
  assert.deepEqual(snapshot(root), before)
  const noYes = run(['init', '--cwd', root, '--agents', 'codex'])
  assert.equal(noYes.code, 2)
  assert.match(noYes.stderr, /pass --yes/)
  assert.deepEqual(snapshot(root), before)
  assert.equal(run(['init', '--cwd', root, '--agents', 'nope', '--yes']).code, 2)
})

test('no agent found and no terminal: init asks for --agents', () => {
  const root = copyFixture('react-vite')
  rmSync(path.join(root, 'CLAUDE.md'))
  rmSync(path.join(root, '.cursor'), { recursive: true })
  const r = run(['init', '--cwd', root, '--yes'])
  assert.equal(r.code, 2)
  assert.match(r.stderr, /pass --agents/)
})

test('plain HTML site with an existing AGENTS.md, in a path with spaces', () => {
  const root = copyFixture('plain html site')
  const before = snapshot(root)
  const r = run(['init', '--cwd', root, '--agents', 'codex,zed', '--yes'])
  assert.equal(r.code, 0, r.stderr)
  const agents = readFileSync(path.join(root, 'AGENTS.md'), 'utf8')
  assert.ok(agents.startsWith(before['AGENTS.md']))
  assert.match(agents, /frontend-skills:start/)
  assert.ok(existsSync(path.join(root, '.agents/skills/fe-html/SKILL.md')))
  assert.match(r.stdout, /html\/doctype|a11y\/img-alt/)
  run(['uninstall', '--cwd', root, '--yes'])
  assert.deepEqual(snapshot(root, outputs), before)
})

test('project helpers reach the profile, the instruction block and helper rules', () => {
  const root = copyFixture('scss-helpers')
  const r = run(['init', '--cwd', root, '--yes'])
  assert.equal(r.code, 0, r.stderr)
  assert.match(r.stdout, /Coding agents found in this project: copilot/)
  assert.ok(!existsSync(path.join(root, 'AGENTS.md')), "Copilot's own instructions file exists, so no AGENTS.md is created")
  const block = readFileSync(path.join(root, '.github/copilot-instructions.md'), 'utf8')
  assert.match(block, /write rem with `rem-calc\(\)`/)
  assert.match(block, /`ico-<name>`/)
  const a = run(['audit', '--cwd', root, '--json', '--fail-on', 'none'])
  const json = JSON.parse(a.stdout)
  assert.deepEqual(json.rules['css/rem-helper'].at, ['src/styles/main.scss:12'])
  assert.match(json.rules['css/rem-helper'].fix, /rem-calc\(16px\)/)
  assert.deepEqual(json.rules['html/project-icons'].at, ['index.html:9'])
  const ex = run(['explain', 'css/rem-helper', '--cwd', root])
  assert.match(ex.stdout, /src\/styles\/_functions\.scss/)
  assert.match(run(['explain', 'css/rem-helper']).stdout, /its rem function/)
})

test('monorepo with Gemini CLI and Kiro', () => {
  const root = copyFixture('monorepo')
  const r = run(['init', '--cwd', root, '--yes'])
  assert.equal(r.code, 0, r.stderr)
  assert.match(readFileSync(path.join(root, 'GEMINI.md'), 'utf8'), /frontend-skills:start/)
  assert.ok(existsSync(path.join(root, '.kiro/skills/fe-react/SKILL.md')))
  assert.ok(existsSync(path.join(root, '.kiro/steering/fe-react.md')))
  assert.ok(existsSync(path.join(root, '.agents/skills/fe-react/SKILL.md')))
  const a = JSON.parse(run(['audit', '--cwd', root, '--json']).stdout)
  assert.deepEqual(a.rules['a11y/html-lang'].at, ['apps/web/app/layout.tsx:3'])
})

test('audit: exit codes, threshold, scope, suppression, report, --changed in git', () => {
  const root = copyFixture('react-vite')
  const a = run(['audit', '--cwd', root, '--json'])
  assert.equal(a.code, 1)
  const json = JSON.parse(a.stdout)
  assert.equal(json.failed, true)
  assert.deepEqual(json.rules['react/no-array-index-key'].at, ['src/App.tsx:12'])
  assert.deepEqual(json.rules['a11y/focus-visible'].at.sort(), ['src/App.tsx:16', 'src/app.css:9'])
  assert.equal(run(['audit', '--cwd', root, '--fail-on', 'none', '--no-report']).code, 0)
  assert.equal(run(['audit', '--cwd', root, '--fail-on', 'bogus']).code, 2)
  const scoped = JSON.parse(run(['audit', 'src/app.css', '--cwd', root, '--json']).stdout)
  assert.deepEqual(Object.keys(scoped.rules).sort(), ['a11y/focus-visible', 'css/asset-url', 'perf/font-display'])
  const app = path.join(root, 'src/App.tsx')
  writeFileSync(app, readFileSync(app, 'utf8').replace('<img src="/hero.jpg" />', '{/* fs-ignore a11y/img-alt */}\n      <img src="/hero.jpg" />'))
  const ignored = JSON.parse(run(['audit', '--cwd', root, '--json', '--fail-on', 'none']).stdout)
  assert.equal(ignored.rules['a11y/img-alt'], undefined)
  assert.ok(ignored.rules['perf/img-dimensions'], 'only the named rule is suppressed')
  const md = readFileSync(path.join(root, 'frontend-report.md'), 'utf8')
  assert.match(md, /## Critical/)
  assert.match(md, /Checklist for a person/)
  assert.match(md, /Not checked/)
  const git = (...args) => execFileSync('git', args, { cwd: root, stdio: 'ignore' })
  git('init', '-q')
  git('add', '.')
  git('-c', 'user.name=t', '-c', 'user.email=t@example.com', 'commit', '-qm', 'base')
  assert.equal(JSON.parse(run(['audit', '--cwd', root, '--json', '--changed']).stdout).rules['a11y/focus-visible'], undefined)
  writeFileSync(path.join(root, 'src/app.css'), `${readFileSync(path.join(root, 'src/app.css'), 'utf8')}\n.x:focus { outline: 0; }\n`)
  const changed = JSON.parse(run(['audit', '--cwd', root, '--json', '--changed']).stdout)
  assert.deepEqual(Object.keys(changed.rules).sort(), ['a11y/focus-visible', 'css/asset-url', 'perf/font-display'])
})

test('learn records a confirmed lesson and refreshes the profile', () => {
  const root = copyFixture('react-vite')
  run(['init', '--cwd', root, '--yes', '--no-audit'])
  const l = run(['learn', '--cwd', root, '--lesson', 'Buttons come from src/ui/Button.tsx.', '--kind', 'convention', '--yes'])
  assert.equal(l.code, 0, l.stderr)
  assert.match(readFileSync(path.join(root, '.frontend-skills/lessons.md'), 'utf8'), /· convention · Buttons come from src\/ui\/Button\.tsx\./)
  assert.equal(run(['learn', '--cwd', root, '--lesson', 'password: hunter22', '--yes']).code, 2)
  const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
  pkg.devDependencies.sass = '^1.108.2'
  writeFileSync(path.join(root, 'package.json'), JSON.stringify(pkg))
  const refresh = run(['learn', '--cwd', root, '--yes'])
  assert.match(refresh.stdout, /\+ sass/)
  assert.ok(JSON.parse(readFileSync(path.join(root, '.frontend-skills/profile.json'), 'utf8')).stack.includes('sass'))
})

test('explain, list, tokens and help', () => {
  const e = run(['explain', 'a11y/img-alt'])
  assert.match(e.stdout, /WCAG 1\.1\.1/)
  assert.match(e.stdout, /https:\/\/www\.w3\.org\/WAI\/WCAG22\/Understanding\/non-text-content\.html/)
  assert.equal(run(['explain', 'a11y/nope']).code, 2)
  assert.match(run(['list', '--rules']).stdout, /react\/no-array-index-key/)
  assert.match(run(['tokens', '--all']).stdout, /fe-react/)
  assert.equal(run(['--help']).code, 0)
  assert.equal(run(['bogus']).code, 2)
})
