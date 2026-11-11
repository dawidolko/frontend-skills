# Frontend Skills

Skills for AI coding agents that work on front-end code: HTML, CSS, JavaScript and the frameworks built on them, with accessibility, responsive layout and page speed checked against the public standards.

**Status: in preparation.** The skills, the command that fits them to your project and the documentation are being built in this repository. The site will be at [skills.dawidolko.pl](https://skills.dawidolko.pl).

Free and open source, under the [MIT licence](LICENSE).

## Author

[Dawid Olko](https://dawidolko.pl)

## Development

The command has no runtime dependencies and no build step; Biome (format and lint) and a public tokenizer (to calibrate the token estimate) are the only dev dependencies. The command runs on Node.js 20 or newer; development and CI use Node.js 22, 24 and 26.

```sh
npm ci
npm run check            # Biome, skill and rule validator, headers, links (offline), token estimate, all tests
npm run links:online     # also request every source link
node cli/index.mjs --help
```

- How it is built: [docs/architecture.md](docs/architecture.md)
- Writing skills and rules: [docs/authoring.md](docs/authoring.md)
- Which agents read what: [docs/agents.md](docs/agents.md)
- The skills to write, by lane: [docs/skills-plan.md](docs/skills-plan.md)
- How token cost is measured: [docs/tokens.md](docs/tokens.md)
