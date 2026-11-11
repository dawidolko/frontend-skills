/*
 * Continue: rules in .continue/rules/*.md with name, description, globs (an array) and alwaysApply: false. Skills
 * and AGENTS.md support are not documented, so each rule points to the one copy of the skill in the project.
 * Source: https://docs.continue.dev/customize/deep-dives/rules (2026-11-11).
 */
import { digest, frontMatter, oneLine, yamlFlow, yamlQuoted } from './shared.mjs'

export default {
  id: 'continue',
  label: 'Continue',
  detect: ['.continue'],
  skillDirs: [],
  instructions: null,
  rule: (skill, ctx) => ({
    path: `.continue/rules/${skill.name}.md`,
    text:
      frontMatter([
        yamlQuoted('name', skill.title),
        yamlQuoted('description', oneLine(skill.description)),
        yamlFlow('globs', skill.globs),
        'alwaysApply: false'
      ]) + digest(skill, ctx.skillPath(skill), { description: false })
  }),
  ruleGlobs: (text) => JSON.parse(/^globs: (\[.*\])$/m.exec(text)?.[1] || '[]'),
  ruleAlways: true,
  notes: [],
  source: 'https://docs.continue.dev/customize/deep-dives/rules'
}
