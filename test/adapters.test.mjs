/*
 * Proves each adapter on a fixture project: the skills land in a folder the agent reads (per docs/agents.md), the
 * glob-scoped rule file lands in the agent's rules folder with its own front matter key, and the globs it writes
 * select the files the skill is about (src/App.tsx for React) and not unrelated ones (CSS, package.json). Also the
 * folder cover: the fewest folders, the fewest duplicates.
 */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ADAPTERS, adapter, chooseSkillDirs, resolveAgents } from '../adapters/index.mjs'
import { loadSkills } from '../cli/lib/catalog.mjs'
import { matchesAny } from '../cli/lib/glob.mjs'
import { planInstall } from '../cli/lib/install.mjs'
import { copyFixture } from './helpers.mjs'

/* Where each agent reads skills and glob rules, copied from docs/agents.md (checked 2026-11-11). */
const DOCUMENTED = {
  claude: { skills: ['.claude/skills'], rules: /^\.claude\/rules\/fe-react\.md$/, key: /^paths:\n {2}- "\*\*\/\*\.jsx"/m },
  codex: { skills: ['.agents/skills'], rules: null },
  cursor: {
    skills: ['.agents/skills', '.cursor/skills', '.claude/skills', '.codex/skills'],
    rules: /^\.cursor\/rules\/fe-react\.mdc$/,
    key: /^globs: \*\*\/\*\.jsx, \*\*\/\*\.tsx\nalwaysApply: false$/m
  },
  copilot: {
    skills: ['.github/skills', '.claude/skills', '.agents/skills'],
    rules: /^\.github\/instructions\/fe-react\.instructions\.md$/,
    key: /^applyTo: "\*\*\/\*\.jsx,\*\*\/\*\.tsx"$/m
  },
  gemini: { skills: ['.agents/skills', '.gemini/skills'], rules: null },
  antigravity: { skills: ['.agents/skills'], rules: /^\.agents\/rules\/fe-react\.md$/, key: /^trigger: glob\nglobs: "\*\*\/\*\.jsx, \*\*\/\*\.tsx"$/m },
  devin: {
    skills: ['.agents/skills', '.devin/skills', '.windsurf/skills'],
    rules: /^\.devin\/rules\/fe-react\.md$/,
    key: /^trigger: glob\nglobs: "\*\*\/\*\.jsx,\*\*\/\*\.tsx"$/m
  },
  opencode: { skills: ['.opencode/skills', '.claude/skills', '.agents/skills'], rules: null },
  cline: { skills: ['.cline/skills', '.clinerules/skills', '.claude/skills'], rules: /^\.clinerules\/fe-react\.md$/, key: /^paths:\n {2}- "/m },
  zed: { skills: ['.agents/skills'], rules: null },
  junie: { skills: ['.junie/skills', '.agents/skills'], rules: null },
  kiro: {
    skills: ['.kiro/skills'],
    rules: /^\.kiro\/steering\/fe-react\.md$/,
    key: /^inclusion: fileMatch\nfileMatchPattern: \["\*\*\/\*\.jsx", "\*\*\/\*\.tsx"\]$/m
  },
  augment: { skills: ['.augment/skills', '.claude/skills', '.agents/skills'], rules: null },
  trae: { skills: ['.trae/skills'], rules: /^\.trae\/rules\/fe-react\.md$/, key: /^globs: \*\*\/\*\.jsx,\*\*\/\*\.tsx\nalwaysApply: false$/m },
  continue: { skills: [], rules: /^\.continue\/rules\/fe-react\.md$/, key: /^globs: \["\*\*\/\*\.jsx", "\*\*\/\*\.tsx"\]\nalwaysApply: false$/m },
  amazonq: { skills: [], rules: null, instructions: '.amazonq/rules/frontend-skills.md' },
  aider: { skills: [], rules: null, instructions: 'CONVENTIONS.md' }
}

const skills = loadSkills()
const react = skills.find((s) => s.name === 'fe-react')

test('every adapter is documented in this test and in docs/agents.md', () => {
  assert.deepEqual(ADAPTERS.map((a) => a.id).sort(), Object.keys(DOCUMENTED).sort())
})

for (const a of ADAPTERS) {
  test(`${a.label}: files land where the agent reads them`, () => {
    const root = copyFixture('react-vite')
    const plan = planInstall({ root, skills: [react], agents: [a.id], format: 'both' })
    const doc = DOCUMENTED[a.id]
    const skillFile = plan.ops.find((o) => o.path.endsWith('fe-react/SKILL.md'))
    assert.ok(skillFile, 'one copy of the skill is written')
    if (doc.skills.length)
      assert.ok(
        doc.skills.some((d) => skillFile.path.startsWith(`${d}/`)),
        `${skillFile.path} is in a folder ${a.label} reads`
      )
    else assert.ok(skillFile.path.startsWith('.frontend-skills/skills/'), 'agents without skills get the support copy')
    const rule = plan.ops.find((o) => o.what === 'rule')
    if (!doc.rules) assert.equal(rule, undefined)
    else {
      assert.match(rule.path, doc.rules)
      assert.match(rule.text, doc.key)
      assert.ok(rule.text.includes(skillFile.path), 'the rule points to the full skill')
      const globs = a.ruleGlobs(rule.text)
      assert.ok(matchesAny('src/App.tsx', globs), 'selects the React component')
      assert.ok(matchesAny('src/deep/nested/Card.jsx', globs))
      assert.ok(!matchesAny('src/app.css', globs) && !matchesAny('package.json', globs), 'does not select unrelated files')
    }
    if (doc.instructions) assert.ok(plan.ops.some((o) => o.type === 'block' && o.path === doc.instructions))
    const skillOnly = planInstall({ root, skills: [react], agents: [a.id], format: 'skills' })
    assert.equal(skillOnly.ops.filter((o) => o.what === 'rule').length, 0, '--format skills writes no rule files')
  })
}

test('folder cover: shared folders first, fewest duplicates', () => {
  assert.deepEqual(chooseSkillDirs(['claude', 'cursor']).dirs, ['.claude/skills'])
  assert.deepEqual(chooseSkillDirs(['codex', 'cursor', 'gemini', 'zed']).dirs, ['.agents/skills'])
  assert.deepEqual(chooseSkillDirs(['claude', 'codex']).dirs, ['.agents/skills', '.claude/skills'])
  assert.deepEqual(chooseSkillDirs(['kiro', 'trae']).dirs, ['.kiro/skills', '.trae/skills'])
  const all = chooseSkillDirs(ADAPTERS.map((a) => a.id))
  for (const a of ADAPTERS)
    if (a.skillDirs.length)
      assert.ok(
        a.skillDirs.some((d) => all.dirs.includes(d)),
        `${a.id} is covered`
      )
  assert.ok(
    chooseSkillDirs(['claude', 'codex', 'cursor']).duplicates.some((d) => d.agent === 'cursor'),
    'Cursor reads both folders: reported'
  )
})

test('aliases and unknown agents', () => {
  assert.deepEqual(resolveAgents(['windsurf', 'Claude', 'nope']), { ids: ['devin', 'claude'], unknown: ['nope'] })
  assert.equal(adapter('windsurf').id, 'devin')
})

test('Claude Code: block goes to CLAUDE.md when it exists, else AGENTS.md; never a new CLAUDE.md', () => {
  const withClaude = copyFixture('react-vite')
  assert.ok(planInstall({ root: withClaude, skills: [react], agents: ['claude'] }).ops.some((o) => o.type === 'block' && o.path === 'CLAUDE.md'))
  const without = copyFixture('plain html site')
  const ops = planInstall({ root: without, skills: [react], agents: ['claude'] }).ops
  assert.ok(ops.some((o) => o.type === 'block' && o.path === 'AGENTS.md'))
  assert.ok(!ops.some((o) => o.path === 'CLAUDE.md'))
})

test('Zed: the block goes into the first instruction file Zed reads', () => {
  const root = copyFixture('scss-helpers')
  assert.ok(planInstall({ root, skills: [react], agents: ['zed'] }).ops.some((o) => o.type === 'block' && o.path === '.github/copilot-instructions.md'))
})
