/*
 * Aider: no file is loaded on its own; files listed under `read:` in .aider.conf.yml are. The block and the skill
 * index go into CONVENTIONS.md, and .aider.conf.yml is created with `read: CONVENTIONS.md` only when it does not
 * exist (an existing one is never edited; the plan tells the person what to add).
 * Source: https://aider.chat/docs/usage/conventions.html (2026-11-11).
 */
export default {
  id: 'aider',
  label: 'Aider',
  detect: ['.aider.conf.yml', 'CONVENTIONS.md'],
  skillDirs: [],
  instructions: 'CONVENTIONS.md',
  withIndex: true,
  rule: null,
  extra: () => [{ path: '.aider.conf.yml', text: 'read: CONVENTIONS.md\n', createOnly: true, hint: 'add "read: CONVENTIONS.md" to .aider.conf.yml' }],
  notes: [],
  source: 'https://aider.chat/docs/usage/conventions.html'
}
