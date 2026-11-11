/*
 * The timeline of the Frontend Skills video, shared by the scenes in the browser (player.mjs), the sound track
 * (audio.mjs) and the voice-over script (voiceover.md, written by build.mjs). Every time is in seconds from the start
 * of the video. A scene owns [start, end); its beats are seconds from the scene's start and drive both the picture
 * and the sounds, so they stay aligned. Voice slots are the stretches left for the narrator, with a suggested line in
 * Polish and English; the sound track keeps only quiet effects inside them.
 */

export const FPS = 30

/** The numbers the narration says aloud; build.mjs stops when the recorded data no longer matches them. */
export const SPOKEN = { installed: 41, skills: 50, rules: 275 }
export const FADE = 0.35

const LENGTHS = [
  ['title', 7],
  ['problem', 10],
  ['command', 7],
  ['init', 20],
  ['agents', 16],
  ['conventions', 12],
  ['audit', 18],
  ['explain', 13],
  ['site', 14],
  ['fix', 21],
  ['outro', 12]
]

/** Scene-local moments that both the picture and the sound use. */
export const BEATS = {
  title: { mark: 0.3, land: 1.0, name: 1.2, tagline: 2.2, url: 3.0 },
  problem: { headline: 0.3, code: 1.4, marks: [3.2, 4.6, 6.0, 7.4] },
  command: { headline: 0.3, typeStart: 2.0, typeEnd: 5.0, enter: 5.3 },
  init: { typeStart: 0.4, typeEnd: 2.2, enter: 2.4, lineMs: 55, callouts: [8.0, 10.5, 13.0] },
  agents: { headline: 0.3, files: 1.2, fileStep: 0.45, formats: 8.6, cards: [9.2, 9.9, 10.6] },
  conventions: { headline: 0.3, block: 1.4, finding: 5.0, finding2: 7.0 },
  audit: { typeStart: 0.4, typeEnd: 1.8, enter: 2.0, lineMs: 70, card: 6.5, exit: 12.0 },
  explain: { typeStart: 0.4, typeEnd: 2.2, enter: 2.4, lineMs: 60, marks: [7.5, 9.0, 10.5] },
  site: { headline: 0.3, list: 1.0, scrollStart: 3.0, scrollEnd: 7.0, rule: 7.6 },
  fix: { code: 0.4, edits: [1.4, 2.4, 3.4, 4.4, 5.4, 6.4, 7.4, 8.4], typeStart: 10.0, typeEnd: 11.4, enter: 11.6, lineMs: 90, pass: 13.4 },
  outro: { mark: 0.3, name: 1.0, chips: 2.0, command: 3.2, url: 4.4 }
}

let at = 0
export const SCENES = LENGTHS.map(([id, length]) => {
  const scene = { id, start: at, end: at + length }
  at += length
  return scene
})
export const TOTAL = at

const startOf = (id) => SCENES.find((s) => s.id === id).start

/** Sound cues: { t, kind, gain } with kind in riser, whoosh, click, pop, tick, chime. */
export const CUES = (() => {
  const cues = [
    { t: 0, kind: 'riser', gain: 0.5 },
    { t: BEATS.title.land, kind: 'pop', gain: 0.55 }
  ]
  for (const s of SCENES.slice(1)) cues.push({ t: s.start - FADE, kind: 'whoosh', gain: 0.5 })
  const at = (id, beat, kind, gain) => cues.push({ t: startOf(id) + beat, kind, gain })
  for (const b of BEATS.problem.marks) at('problem', b, 'tick', 0.35)
  at('command', BEATS.command.enter, 'click', 0.5)
  at('init', BEATS.init.enter, 'click', 0.45)
  for (const b of BEATS.init.callouts) at('init', b, 'pop', 0.35)
  for (const b of BEATS.agents.cards) at('agents', b, 'pop', 0.3)
  at('conventions', BEATS.conventions.finding, 'pop', 0.35)
  at('conventions', BEATS.conventions.finding2, 'pop', 0.3)
  at('audit', BEATS.audit.enter, 'click', 0.45)
  at('audit', BEATS.audit.card, 'pop', 0.4)
  at('explain', BEATS.explain.enter, 'click', 0.45)
  for (const b of BEATS.explain.marks) at('explain', b, 'tick', 0.3)
  at('site', BEATS.site.rule, 'pop', 0.3)
  for (const b of BEATS.fix.edits) at('fix', b, 'tick', 0.35)
  at('fix', BEATS.fix.enter, 'click', 0.45)
  at('fix', BEATS.fix.pass, 'chime', 0.55)
  at('outro', BEATS.outro.mark, 'pop', 0.45)
  at('outro', BEATS.outro.url, 'chime', 0.35)
  return cues.sort((a, b) => a.t - b.t)
})()

/** Voice slots: scene-local start and end, what is on screen, and a suggested line in Polish and English. */
const LINES = [
  {
    scene: 'title',
    from: 1.0,
    to: 6.4,
    screen: 'The mark draws itself; "Frontend Skills" and the tagline appear.',
    pl: 'Frontend Skills: darmowe skille dla agentów AI, którzy piszą Twój front-end.',
    en: 'Frontend Skills: free skills for the AI agents that write your front-end code.'
  },
  {
    scene: 'problem',
    from: 0.6,
    to: 9.4,
    screen: 'A React component; four lines get marked: no alt, not a button, no label, focus removed.',
    pl: 'Agenci AI piszą front-end szybko. Ale zapominają o tekstach alternatywnych, etykietach i fokusie, a nikt im nie mówi, co mówią standardy.',
    en: 'AI agents write front-end code fast. But they forget alt text, labels and focus styles, and nobody tells them what the standards say.'
  },
  {
    scene: 'command',
    from: 0.6,
    to: 6.4,
    screen: '"One command. Your stack. Every agent." and the command being typed.',
    pl: 'Dlatego jest jedna komenda. Poznaje Twój stos i instaluje właściwe skille w każdym agencie, którego używasz.',
    en: 'So here is one command. It learns your stack and installs the right skills into every agent you use.'
  },
  {
    scene: 'init',
    from: 1.0,
    to: 19.2,
    screen: 'The real init output; callouts: the stack, the agents found, 41 of 50 skills.',
    pl: 'W tym projekcie Reacta wykrywa Reacta 19, TypeScript i Tailwinda, widzi Claude Code i Cursora i instaluje czterdzieści jeden z pięćdziesięciu skilli. Od razu robi też pierwszy audyt.',
    en: 'In this React project it finds React 19, TypeScript and Tailwind, sees Claude Code and Cursor, and installs forty-one of the fifty skills. Then it runs the first audit straight away.'
  },
  {
    scene: 'agents',
    from: 0.8,
    to: 15.2,
    screen: 'The files written for four agents, then the same skill as a Claude Code, Cursor and Copilot rule file.',
    pl: 'Każdy agent dostaje pliki, które naprawdę czyta: foldery skilli, reguły przypisane do typów plików i jeden krótki blok w AGENTS.md albo CLAUDE.md. Ten sam skill, w formacie każdego agenta.',
    en: "Each agent gets the files it actually reads: skills folders, rule files scoped to the right file types, and one short block in AGENTS.md or CLAUDE.md. The same skill, in each agent's own format."
  },
  {
    scene: 'conventions',
    from: 0.8,
    to: 11.2,
    screen: 'The "This project" block (rem-calc, icon classes, tokens) and two findings in the project\'s own terms.',
    pl: 'Uczy się też Twoich konwencji. Jeśli projekt ma funkcję rem-calc albo font z ikonami, reguły i poprawki z nich korzystają.',
    en: 'It also learns your conventions. If your project has a rem-calc function or an icon font, the rules and the fixes use them.'
  },
  {
    scene: 'audit',
    from: 0.8,
    to: 17.2,
    screen: 'The real audit summary, then the a11y/img-alt finding as a card: file and line, why, fix, source; exit code 1.',
    pl: 'Audyt pokazuje, co jest źle: ze stałym identyfikatorem reguły, plikiem i linią, powodem i poprawką. Kod wyjścia pozwala zatrzymać CI na poważnych problemach.',
    en: 'The audit reports what is wrong, with a stable rule id, the file and the line, why it matters and how to fix it. The exit code lets your CI stop on serious problems.'
  },
  {
    scene: 'explain',
    from: 0.8,
    to: 12.2,
    screen: 'The real explain output for a11y/img-alt; Why, Fix and Sources light up in turn.',
    pl: 'Explain wypisuje każdą regułę w całości: powód, poprawkę, przykłady i źródła, od WCAG po MDN.',
    en: 'Explain prints any rule in full: why, the fix, examples and the sources, from WCAG to MDN.'
  },
  {
    scene: 'site',
    from: 0.8,
    to: 13.2,
    screen: 'The dictionary page of skills.dawidolko.pl scrolls; then the page of a11y/img-alt.',
    pl: 'Wszystkie dwieście siedemdziesiąt pięć reguł jest też na stronie, po polsku i po angielsku, z tymi samymi identyfikatorami, których używa agent.',
    en: 'All two hundred and seventy-five rules are on the website too, in English and Polish, with the same ids your agent uses.'
  },
  {
    scene: 'fix',
    from: 0.8,
    to: 20.2,
    screen: 'Eight edits appear in App.tsx (app.css, index.html and tsconfig.json are fixed too), then the audit again: 0 findings, "Passed", a green check.',
    pl: 'Teraz agent albo Ty poprawiacie kod: prawdziwy tekst alternatywny, przycisk zamiast diva, etykieta, widoczny fokus. Audyt jeszcze raz i jest zielono.',
    en: "Now the agent, or you, fixes the code: a real alt text, a button instead of a div, a label, a visible focus style. Run the audit again, and it's green."
  },
  {
    scene: 'outro',
    from: 1.0,
    to: 10.5,
    screen: 'The mark, the counts, the command and the address skills.dawidolko.pl.',
    pl: 'Frontend Skills jest darmowe i open source. Wypróbuj jedną komendą, a wszystko znajdziesz na skills.dawidolko.pl.',
    en: 'Frontend Skills is free and open source. Try it with one command, and find everything at skills.dawidolko.pl.'
  }
]

export const VOICE = LINES.map((l) => ({ ...l, start: startOf(l.scene) + l.from, end: startOf(l.scene) + l.to }))

/** On-screen text in both languages; {name} is filled from the recorded data. Code and tool output stay as they are. */
export const TEXT = {
  en: {
    tagline: 'Skills for the AI agents that write your front-end code',
    problem: ['AI agents write front-end fast.', 'And forget the basics.'],
    marks: ['no alt text', 'not a button', 'no label', 'focus removed'],
    command: ['One command.', 'Your stack. Every agent.'],
    callouts: ['Stack detected', 'Agents found', 'Installed'],
    installed: '{n} of {all} skills · {files} files · first audit',
    agents: ['Each agent gets', 'the files it reads'],
    formats: 'One skill, each agent’s format',
    files: ['file', 'files'],
    block: 'marked block',
    conventions: ['It learns', 'your conventions'],
    blockTitle: 'Always-on block, “This project”',
    finding: 'The audit uses your helpers',
    audit: 'Every finding: rule id · file:line · why · fix · source',
    why: 'Why',
    fix: 'Fix',
    exit: 'exit 1 → CI stops on serious findings',
    explainMarks: ['why it matters', 'how to fix it', 'public sources'],
    site: ['{rules} rules,', 'one dictionary'],
    siteNote: 'skills.dawidolko.pl · English and Polish',
    fixTitle: 'Fix, then audit again',
    pass: 'Green',
    outro: 'Free and open source · MIT',
    chips: ['{skills} skills', '{rules} rules', '{agents} agents']
  },
  pl: {
    tagline: 'Skille dla agentów AI, którzy piszą Twój front-end',
    problem: ['Agenci AI piszą front-end szybko.', 'I zapominają o\u00a0podstawach.'],
    marks: ['brak alt', 'to nie przycisk', 'brak etykiety', 'usunięty fokus'],
    command: ['Jedna komenda.', 'Twój stos. Każdy agent.'],
    callouts: ['Wykryty stos', 'Znalezieni agenci', 'Zainstalowane'],
    installed: '{n} z\u00a0{all} skilli · {files} plików · pierwszy audyt',
    agents: ['Każdy agent dostaje', 'pliki, które czyta'],
    formats: 'Jeden skill, format każdego agenta',
    files: ['plik', 'pliki', 'plików'],
    block: 'oznaczony blok',
    conventions: ['Uczy się', 'Twoich konwencji'],
    blockTitle: 'Blok zawsze wczytywany, „This project”',
    finding: 'Audyt używa Twoich helperów',
    audit: 'Każde znalezisko: id reguły · plik:linia · powód · poprawka · źródło',
    why: 'Dlaczego',
    fix: 'Poprawka',
    exit: 'exit 1 → CI zatrzymuje się na poważnych',
    explainMarks: ['dlaczego to ważne', 'jak poprawić', 'publiczne źródła'],
    site: ['{rules} reguł,', 'jeden słownik'],
    siteNote: 'skills.dawidolko.pl · po polsku i\u00a0po angielsku',
    fixTitle: 'Popraw i sprawdź jeszcze raz',
    pass: 'Zielono',
    outro: 'Darmowe i open source · MIT',
    chips: ['{skills} skilli', '{rules} reguł', '{agents} agentów']
  }
}
