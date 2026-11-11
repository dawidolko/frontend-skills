/*
 * Text shared by the adapters: the digest of a skill (its description, its "## Rules" section and the path of the
 * full skill) that glob-scoped rule files carry, the index of skills for agents that read no skills folder, and the
 * small YAML writers each agent's front matter needs. Every agent's exact syntax is documented in docs/agents.md.
 */
import { sections } from '../cli/lib/catalog.mjs'

/** The "## Rules" section of a skill body. */
export const rulesSection = (skill) => sections(skill.body).rules || ''

/** The body of a glob-scoped rule file; the description is left out when the front matter already carries it. */
export function digest(skill, skillPath, { description = true } = {}) {
  return [
    `# ${skill.title} (frontend-skills)`,
    '',
    ...(description ? [skill.description, ''] : []),
    rulesSection(skill),
    '',
    `Before larger changes, read the full skill: \`${skillPath}\`. Explain any rule id with \`npx github:dawidolko/frontend-skills explain <id>\`.`,
    ''
  ].join('\n')
}

/** One line per skill, for agents that read no skills folder. */
export function skillIndex(skills, pathOf) {
  return skills
    .map((s) => `- \`${s.name}\` (${s.title}): when editing ${s.globs.map((g) => `\`${g}\``).join(', ')}, first read \`${pathOf(s)}\`.`)
    .join('\n')
}

const q = (s) => JSON.stringify(s)
export const yamlList = (key, items) => `${key}:\n${items.map((i) => `  - ${q(i)}`).join('\n')}`
export const yamlFlow = (key, items) => `${key}: [${items.map(q).join(', ')}]`
export const yamlQuoted = (key, v) => `${key}: ${q(v)}`
export const frontMatter = (lines) => `---\n${lines.join('\n')}\n---\n\n`

/** A description safe for any YAML reader: one line, quoted. */
export const oneLine = (s) => s.replace(/\s+/g, ' ').trim()
