/*
 * GitHub Copilot (VS Code, CLI, cloud agent, code review): skills in .github/skills, .claude/skills or .agents/skills;
 * glob-scoped instructions in .github/instructions/<name>.instructions.md with applyTo (quoted, comma-separated);
 * always-on instructions in AGENTS.md, or in .github/copilot-instructions.md when only that exists.
 * Sources: https://docs.github.com/en/copilot/concepts/agents/about-agent-skills,
 * https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions (2026-11-11).
 */
import { existsSync } from 'node:fs'
import path from 'node:path'
import { digest, frontMatter, oneLine, yamlQuoted } from './shared.mjs'

export default {
  id: 'copilot',
  label: 'GitHub Copilot',
  detect: ['.github/copilot-instructions.md', '.github/instructions', '.github/skills', '.github/prompts'],
  skillDirs: ['.agents/skills', '.github/skills', '.claude/skills'],
  instructions: (root) =>
    !existsSync(path.join(root, 'AGENTS.md')) && existsSync(path.join(root, '.github', 'copilot-instructions.md'))
      ? '.github/copilot-instructions.md'
      : 'AGENTS.md',
  rule: (skill, ctx) => ({
    path: `.github/instructions/${skill.name}.instructions.md`,
    text:
      frontMatter([yamlQuoted('applyTo', skill.globs.join(',')), yamlQuoted('description', oneLine(skill.description))]) +
      digest(skill, ctx.skillPath(skill), { description: false })
  }),
  ruleGlobs: (text) => JSON.parse(/^applyTo: (".*")$/m.exec(text)?.[1] || '""').split(','),
  notes: [],
  source: 'https://docs.github.com/en/copilot/concepts/agents/about-agent-skills'
}
