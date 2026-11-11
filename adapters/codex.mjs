/*
 * OpenAI Codex: skills in .agents/skills, instructions in AGENTS.md (32 KiB combined by default). It has no
 * glob-scoped rule files, only directory scoping. Sources: https://learn.chatgpt.com/docs/build-skills,
 * https://learn.chatgpt.com/docs/agent-configuration/agents-md (2026-11-11).
 */
export default {
  id: 'codex',
  label: 'OpenAI Codex',
  detect: ['.codex', 'AGENTS.override.md'],
  skillDirs: ['.agents/skills'],
  instructions: 'AGENTS.md',
  rule: null,
  notes: [],
  source: 'https://learn.chatgpt.com/docs/build-skills'
}
