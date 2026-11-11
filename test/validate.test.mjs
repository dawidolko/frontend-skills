/*
 * The validator passes on this repository and catches each kind of broken skill or rule on a copy: a name that does
 * not match its folder, an over-budget description, an unknown rule id, a missing source, a static rule without
 * fixtures, a placeholder for a helper the rule does not require.
 */
import assert from 'node:assert/strict'
import { cpSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { validate } from '../tools/validate.mjs'
import { REPO, tempDir } from './helpers.mjs'

test('the repository is valid', () => {
  assert.deepEqual(validate(REPO), [])
})

test('broken skills and rules are reported', () => {
  const root = tempDir('fs validate ')
  for (const p of ['package.json', 'docs/skills-plan.md', 'skills', 'rules', 'cli', 'engine', 'adapters'])
    cpSync(path.join(REPO, p), path.join(root, p), { recursive: true })
  const edit = (rel, fn) => writeFileSync(path.join(root, rel), fn(readFileSync(path.join(root, rel), 'utf8')))
  edit('skills/frameworks/fe-react/SKILL.md', (t) =>
    t.replace('name: fe-react', 'name: fe-reactjs').replace('rules: "react/no-array-index-key', 'rules: "react/nope react/no-array-index-key')
  )
  edit('skills/foundations/fe-html/SKILL.md', (t) => t.replace(/^description: (.*)$/m, (_, d) => `description: ${d} ${'x'.repeat(200)}`))
  edit('rules/a11y/img-alt/rule.md', (t) => t.replace(/sources:[\s\S]*?---/, '---'))
  rmSync(path.join(root, 'rules/perf/font-display/fixtures/good.css'))
  edit('rules/html/doctype/rule.md', (t) => t.replace('## Fix\n', '## Fix\n\nUse {{rem-function.name|x}}.\n'))
  const problems = validate(root)
    .map((p) => `${p.file}: ${p.problem}`)
    .join('\n')
  assert.match(problems, /fe-react\/SKILL\.md: name "fe-reactjs" must equal the folder/)
  assert.match(problems, /metadata\.rules: no rule "react\/nope"/)
  assert.match(problems, /fe-html\/SKILL\.md: description is \d+ characters \(budget 400\)/)
  assert.match(problems, /img-alt\/rule\.md: at least one source is required/)
  assert.match(problems, /font-display\/rule\.md: a static rule needs fixtures\/bad\.\* and fixtures\/good\.\*/)
  assert.match(problems, /doctype\/rule\.md: placeholder for helper "rem-function" without requires/)
})
