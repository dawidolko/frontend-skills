/*
 * The install record and the project tree are untrusted input (a cloned repository carries both): a recorded path
 * that leaves the project (.., backslashes, absolute paths) is ignored by uninstall and update, and a symbolic link
 * inside the project that points elsewhere is never followed for writing or deleting.
 */
import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { readRecord, safeRelative } from '../cli/lib/install.mjs'
import { copyFixture, run } from './helpers.mjs'

test('only plain relative paths are accepted', () => {
  for (const ok of ['AGENTS.md', '.claude/skills/fe-x/SKILL.md', '.github/instructions/fe-x.instructions.md']) assert.ok(safeRelative(ok), ok)
  for (const no of ['../x', 'a/../../x', '/etc/passwd', 'C:/x', 'a\\..\\b', '..\\..\\x', '', '.', 'a//b', 'a/./b', 'a b/c'])
    assert.ok(!safeRelative(no), JSON.stringify(no))
})

test('a crafted install record cannot make uninstall touch files outside the project', () => {
  const outside = mkdtempSync(path.join(tmpdir(), 'fs outside '))
  writeFileSync(path.join(outside, 'victim.md'), 'keep me\n<!-- frontend-skills:start -->\nx\n<!-- frontend-skills:end -->\n')
  const root = copyFixture('react-vite')
  const rel = path.relative(root, path.join(outside, 'victim.md'))
  mkdirSync(path.join(root, '.frontend-skills'), { recursive: true })
  const files = {
    [rel.split(path.sep).join('/')]: { kind: 'block', created: true },
    [rel.split(path.sep).join('\\')]: { kind: 'block', created: true },
    [path.join(outside, 'victim.md')]: { kind: 'file', sha256: 'x', created: true }
  }
  writeFileSync(path.join(root, '.frontend-skills/install.json'), JSON.stringify({ version: 1, agents: ['claude'], files }))
  assert.deepEqual(Object.keys(readRecord(root).files), [])
  const r = run(['uninstall', '--cwd', root, '--yes'])
  assert.equal(r.code, 0, r.stderr)
  assert.match(readFileSync(path.join(outside, 'victim.md'), 'utf8'), /keep me/)
  assert.match(readFileSync(path.join(outside, 'victim.md'), 'utf8'), /frontend-skills:start/)
})

test('a symbolic link inside the project is not followed', { skip: process.platform === 'win32' && 'symlinks need privileges on Windows' }, () => {
  const outside = mkdtempSync(path.join(tmpdir(), 'fs outside '))
  const root = copyFixture('react-vite')
  symlinkSync(outside, path.join(root, '.claude'), 'dir')
  const r = run(['init', '--cwd', root, '--yes', '--no-audit'])
  assert.equal(r.code, 1)
  assert.match(r.stderr, /symbolic link/)
  assert.ok(!existsSync(path.join(outside, 'skills')), 'nothing written through the link')
})
