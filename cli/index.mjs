#!/usr/bin/env node
/*
 * The frontend-skills command: `npx github:dawidolko/frontend-skills <command>`. Dispatches to cli/commands/<name>.mjs,
 * prints help, and maps errors to exit codes (0 fine, 1 findings or problems at the threshold, 2 usage error,
 * 3 a requested tool is not available). Runs on Node 20 or newer with no dependencies and no build step.
 */
import { UsageError, version } from './lib/io.mjs'

const COMMANDS = {
  init: 'Detect the stack and the agents, install the matching skills, write the profile, run the first audit.',
  audit: 'Check the source against the rules (with --url, a running page too) and write the report.',
  learn: 'Refresh the profile after the stack changed, or record a confirmed lesson.',
  list: 'List the skills that fit this project (--all for every skill, --rules for the dictionary).',
  explain: 'Explain a rule: why, fix, examples and sources.',
  doctor: 'Check that every agent has its files and that they are current.',
  update: 'Re-install the recorded selection from this version.',
  uninstall: 'Remove everything this tool wrote.',
  tokens: 'Show the estimated token cost of what is installed.'
}

const HELP = `frontend-skills ${version()}

Usage: npx github:dawidolko/frontend-skills <command> [options]

${Object.entries(COMMANDS)
  .map(([c, d]) => `  ${c.padEnd(10)} ${d}`)
  .join('\n')}

Common options: --cwd <dir>  --json  --help
Run "frontend-skills <command> --help" for the options of one command.
Docs: https://github.com/dawidolko/frontend-skills/blob/main/docs/architecture.md
`

async function main(argv) {
  const [name, ...rest] = argv
  if (!name || name === '--help' || name === '-h' || name === 'help') {
    process.stdout.write(HELP)
    return 0
  }
  if (name === '--version' || name === '-v') {
    process.stdout.write(`${version()}\n`)
    return 0
  }
  if (!(name in COMMANDS)) throw new UsageError(`unknown command "${name}". Run with --help.`)
  const mod = await import(`./commands/${name}.mjs`)
  return mod.default(rest)
}

main(process.argv.slice(2)).then(
  (code) => {
    process.exitCode = code ?? 0
  },
  (err) => {
    if (err instanceof UsageError) {
      process.stderr.write(`frontend-skills: ${err.message}\n`)
      process.exitCode = 2
    } else {
      process.stderr.write(`frontend-skills: ${err.stack || err.message}\n`)
      process.exitCode = err.exitCode || 1
    }
  }
)
