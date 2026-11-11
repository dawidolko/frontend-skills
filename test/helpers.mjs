/*
 * Test helpers: copies a fixture project into a fresh temporary folder whose path contains a space (so every test
 * also proves that paths with spaces work), runs the command as a child process with no terminal attached, and
 * lists a folder's files for before/after comparisons. Every temporary folder is removed when the test process exits.
 */
import { spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const CLI = path.join(REPO, 'cli', 'index.mjs')

const temps = []
process.on('exit', () => {
  for (const d of temps) rmSync(d, { recursive: true, force: true })
})

/** A new temporary folder whose name contains a space; removed when the process exits. */
export function tempDir(prefix = 'fs test ') {
  const d = mkdtempSync(path.join(tmpdir(), prefix))
  temps.push(d)
  return d
}

/** A copy of fixtures/projects/<name> in a new temporary folder named with a space. */
export function copyFixture(name) {
  const base = tempDir()
  const dest = path.join(base, name)
  cpSync(path.join(REPO, 'fixtures', 'projects', name), dest, { recursive: true })
  return dest
}

/** Runs the CLI; returns { code, stdout, stderr }. */
export function run(args, { cwd = REPO, env = {} } = {}) {
  const r = spawnSync(process.execPath, [CLI, ...args], { cwd, env: { ...process.env, ...env }, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  return { code: r.status, stdout: r.stdout, stderr: r.stderr }
}

/** Every file under dir as { relative/path: content }. */
export function snapshot(dir, skip = () => false) {
  const out = {}
  const walk = (d, rel) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const r = rel ? `${rel}/${e.name}` : e.name
      if (skip(r)) continue
      if (e.isDirectory()) walk(path.join(d, e.name), r)
      else out[r] = readFileSync(path.join(d, e.name), 'utf8')
    }
  }
  walk(dir, '')
  return out
}
