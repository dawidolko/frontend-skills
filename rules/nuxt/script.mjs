/*
 * Shared by the nuxt rules: tells a <script setup> block from a plain module script, measures how deeply a position
 * is nested in brackets (0 is the top level of the script, where code runs once per component instance in
 * <script setup> and once per server process in a module), and names the function that encloses a position.
 * Works on code blanked by rules/js/source.mjs, so brackets in strings and comments do not count.
 */
import { scriptBlocks } from '../js/source.mjs'

/** The script blocks of a file with setup: true for <script setup> in a .vue file. */
export function blocks(ctx) {
  return scriptBlocks(ctx).map((b) => {
    let setup = false
    if (ctx.kind === 'vue') {
      const tag = ctx.text.slice(ctx.text.lastIndexOf('<script', b.offset), b.offset)
      setup = /\bsetup\b/.test(tag)
    }
    return { ...b, setup }
  })
}

/** Bracket depth of code at index: 0 at the top level. */
export function depthAt(code, index) {
  let depth = 0
  for (let i = 0; i < index; i++) {
    const c = code[i]
    if (c === '{' || c === '(' || c === '[') depth++
    else if (c === '}' || c === ')' || c === ']') depth--
  }
  return depth
}

/**
 * True when the code at index runs when the module or <script setup> runs: not inside a block ({ }) and not inside
 * a function written in call arguments (onMounted(() => ...), computed(() => ...)).
 */
export function runsAtTopLevel(code, index) {
  const opens = []
  for (let i = 0; i < index; i++) {
    const c = code[i]
    if (c === '{' || c === '(' || c === '[') opens.push(i)
    else if (c === '}' || c === ')' || c === ']') opens.pop()
  }
  for (const at of opens) {
    if (code[at] === '{') return false
    if (/=>|\bfunction\b/.test(code.slice(at, index))) return false
  }
  return true
}

const TRANSPARENT = new Set(['if', 'for', 'while', 'switch', 'catch', 'with', 'else', 'try', 'finally', 'do'])

/**
 * The name of the innermost named function around index ({ name } or null when the position is at the top level
 * or inside an anonymous callback). Blocks of if, for, try and the like are looked through.
 */
export function enclosingFunction(code, index) {
  const opens = []
  for (let i = 0; i < index; i++) {
    const c = code[i]
    if (c === '{' || c === '(' || c === '[') opens.push(i)
    else if (c === '}' || c === ')' || c === ']') opens.pop()
  }
  for (let k = opens.length - 1; k >= 0; k--) {
    const at = opens[k]
    if (code[at] !== '{') continue
    const before = code.slice(Math.max(0, at - 200), at)
    if (/(?:\b(?:else|try|finally|do)|=>\s*)\s*$/.test(before) && !/=>\s*$/.test(before)) continue
    const head = /(?:function\s*\*?\s*([\w$]+)\s*\([^()]*\)|([\w$]+)\s*(?::[^=\n;{}()]+)?=\s*(?:async\s+)?(?:function\s*\*?\s*)?(?:\([^()]*\)|[\w$]+)\s*(?:=>)?|(?:async\s+)?([\w$]+)\s*\([^()]*\))\s*(?::\s*[^{}]+)?$/.exec(before)
    if (!head) return null
    const name = head[1] || head[2] || head[3]
    if (TRANSPARENT.has(name)) continue
    return { name }
  }
  return null
}
