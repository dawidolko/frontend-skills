/*
 * Proves every rule of the dictionary on its own fixtures: each rules/<area>/<name>/fixtures/bad.* file must give
 * at least one finding of that rule, each good.* file none. A bad.json or good.json fixture lists virtual files for
 * a project-level rule. Also checks that a CRLF copy of every fixture gives the same lines as the LF original.
 */
import assert from 'node:assert/strict'
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { loadRules } from '../cli/lib/catalog.mjs'
import { kindOf } from '../engine/files.mjs'
import { runAudit } from '../engine/index.mjs'

const rules = loadRules()

async function findings(rule, dir, file) {
  const stack = new Set(rule.stack)
  if (file.endsWith('.json')) {
    const { files } = JSON.parse(readFileSync(path.join(dir, file), 'utf8'))
    return (await runAudit({ root: dir, rules: [rule], files, stack })).findings
  }
  const size = readFileSync(path.join(dir, file)).length
  return (await runAudit({ root: dir, rules: [rule], files: [{ path: file, kind: kindOf(file), size }], stack })).findings
}

for (const rule of rules.filter((r) => r.hasCheck)) {
  const dir = path.join(rule.dir, 'fixtures')
  let files = []
  try {
    files = readdirSync(dir)
  } catch {
    /* checked below */
  }
  test(`${rule.id} has bad and good fixtures`, () => {
    assert.ok(files.some((f) => f.startsWith('bad.')), 'no fixtures/bad.* file')
    assert.ok(files.some((f) => f.startsWith('good.')), 'no fixtures/good.* file')
  })
  for (const file of files) {
    const bad = file.startsWith('bad.')
    test(`${rule.id} ${bad ? 'reports' : 'accepts'} fixtures/${file}`, async () => {
      const got = (await findings(rule, dir, file)).filter((f) => f.id === rule.id)
      const errors = (await findings(rule, dir, file)).filter((f) => f.id === 'tooling/check-error')
      assert.deepEqual(errors, [], 'the check threw')
      if (bad) assert.ok(got.length > 0, `expected a finding of ${rule.id}`)
      else assert.deepEqual(got, [], `expected no finding, got ${JSON.stringify(got)}`)
    })
    if (!file.endsWith('.json'))
      test(`${rule.id} gives the same lines for a CRLF copy of fixtures/${file}`, async () => {
        const tmp = mkdtempSync(path.join(tmpdir(), 'fs crlf '))
        try {
          const text = readFileSync(path.join(dir, file), 'utf8').replace(/\r?\n/g, '\r\n')
          writeFileSync(path.join(tmp, file), text)
          const lf = (await findings(rule, dir, file)).map((f) => f.line)
          const crlf = (await findings(rule, tmp, file)).map((f) => f.line)
          assert.deepEqual(crlf, lf)
        } finally {
          rmSync(tmp, { recursive: true, force: true })
        }
      })
  }
}
