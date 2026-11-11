/*
 * Amazon Q Developer: every .amazonq/rules/*.md file applies to every chat, with no glob scoping, so one short file
 * holds the always-on block and the one-line index of the skills. Its IDE plugins reach end of support on 2027-04-30.
 * Source: https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/context-project-rules.html (2026-11-11).
 */
export default {
  id: 'amazonq',
  label: 'Amazon Q Developer',
  detect: ['.amazonq'],
  skillDirs: [],
  instructions: '.amazonq/rules/frontend-skills.md',
  ownsInstructions: true,
  withIndex: true,
  rule: null,
  notes: ['Amazon Q Developer IDE plugins reach end of support on 2027-04-30; AWS points to Kiro.'],
  source: 'https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/context-project-rules.html'
}
