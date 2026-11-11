/*
 * Steps several commands share: detecting a project into a fresh profile, turning a profile and a list of agents into
 * an install plan, and printing that plan (what will be written, updated, kept, refused; duplicates and notes) in a
 * few readable lines.
 */
import { adapter } from '../../adapters/index.mjs'
import { loadSkills } from './catalog.mjs'
import { detectHelpers } from './conventions.mjs'
import { detectStack } from './detect.mjs'
import { applyPlan, planInstall } from './install.mjs'
import { today, version } from './io.mjs'
import { buildProfile, matchSkills, readProfile } from './profile.mjs'
import { estimateTokens } from './tokens.mjs'

/** Detects the project and returns { profile, previous, skills } without writing anything. */
export function detectProject(root, agents) {
  const previous = readProfile(root)
  const detected = detectStack(root)
  const helpers = detectHelpers(root)
  const skills = matchSkills(loadSkills(), detected.stack)
  const profile = buildProfile({ detected, helpers, agents, skills, previous, version: version(), today: today() })
  return { profile, previous, skills }
}

/** The skills a profile names, from this version of the catalog. */
export const skillsOf = (profile) => {
  const names = new Set(profile?.skills || [])
  return loadSkills().filter((s) => names.has(s.name))
}

export function makePlan(root, { profile, agents, format }) {
  return planInstall({ root, skills: skillsOf(profile), agents, format, helpers: profile.helpers || {} })
}

/** Lines describing a profile. */
export function describeProfile(profile) {
  const L = []
  for (const p of profile.projects) {
    const fw = Object.entries(p.frameworks).map(([k, v]) => (v ? `${k} ${v}` : k))
    const extra = [p.typescript ? `typescript${p.typescript !== 'unknown' ? ` ${p.typescript}` : ''}` : null, ...p.styling, ...p.testing].filter(Boolean)
    L.push(`  ${p.path === '.' ? 'project' : p.path}: ${[...fw, ...extra].join(', ') || (p.plainHtml ? 'plain HTML site' : 'no front-end framework found')}`)
  }
  if (profile.monorepo) L.push(`  monorepo (${profile.monorepo.tool}): ${profile.monorepo.packages.length} packages`)
  for (const [id, h] of Object.entries(profile.helpers || {})) L.push(`  helper ${id}: ${h.name || h.tool || h.file || ''}${h.prefix ? ` (prefix ${h.prefix})` : ''}`)
  return L
}

/** Prints the plan; returns the dry-run result. */
export function showPlan(root, plan, { agents, skills, out }) {
  const dry = applyPlan(root, plan, { dryRun: true })
  out(`Agents: ${agents.map((a) => adapter(a).label).join(', ')}`)
  out(`Skills (${skills.length}): ${skills.map((s) => `${s.name} (~${estimateTokens(s.text)} tokens)`).join(', ') || 'none match this stack'}`)
  out(`Skills folders: ${plan.dirs.join(', ') || 'none'}`)
  const show = (label, list) => {
    if (!list.length) return
    out(`${label} (${list.length}):`)
    for (const p of list.slice(0, 40)) out(`  ${p}`)
    if (list.length > 40) out(`  … and ${list.length - 40} more`)
  }
  show('New files', dry.written)
  show('Updated', dry.updated)
  show('Removed (no longer planned)', dry.removed)
  show('Kept, changed by you', dry.kept)
  show('Not written, the file exists and is yours', dry.conflicts)
  if (dry.unchanged.length) out(`Unchanged: ${dry.unchanged.length} files`)
  for (const d of plan.duplicates) out(`Note: ${adapter(d.agent).label} reads ${d.dirs.join(' and ')}, so it lists each skill twice.`)
  for (const n of plan.notes) out(`Note: ${n}`)
  for (const h of plan.hints) out(`To do by hand: ${h}`)
  return dry
}
