#!/usr/bin/env node
// 原生元素守卫:app 的 .vue 模板里不许直接写 <input> <select> <button> <table> 这类原生元素,
// 一律用组件库的组件(Input / Select / Button / Table …),外观和交互才统一。
//
// 用法(app build 开头跑,发现问题退出码 1):
//   bun node_modules/mikuro-ui/scripts/check-raw-html.mjs src
//   bun node_modules/mikuro-ui/scripts/check-raw-html.mjs src --skip src/legacy
//
// 确实要用原生元素的(比如隐藏的 <input type="file">):同一行或上一行写 mk-allow-raw 并写明原因,
//   <!-- mk-allow-raw: 文件选择框,由 Button 触发 -->
// 只看 <template> 里的内容;组件库自己的 src/components 由库的 build 用 --skip 排除。
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative, resolve, sep } from 'node:path'

// 原生元素 → 该用的组件
const BANNED = {
  input: 'Input(复选 / 单选另议,先问)',
  select: 'Select',
  option: 'SelectItem',
  textarea: 'Textarea',
  button: 'Button,或 ListRow / ActionTile 这类可点的家庭组件',
  label: 'Label',
  table: 'Table',
  thead: 'TableHeader',
  tbody: 'TableBody',
  tr: 'TableRow',
  th: 'TableHead',
  td: 'TableCell',
  dialog: 'Dialog / AlertDialog / Drawer',
}
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', '.wrangler'])

const args = process.argv.slice(2)
const roots = [], skips = []
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--skip') skips.push(resolve(args[++i]))
  else roots.push(resolve(args[i]))
}
if (!roots.length) roots.push(resolve('src'))
const skipped = p => skips.some(s => p === s || p.startsWith(s + sep))

function* walk(p) {
  if (skipped(p)) return
  const st = statSync(p)
  if (st.isDirectory()) {
    for (const n of readdirSync(p)) if (!SKIP_DIRS.has(n)) yield* walk(join(p, n))
  } else if (extname(p) === '.vue') yield p
}

const TAG_RE = new RegExp(`<(${Object.keys(BANNED).join('|')})(?=[\\s>/])`, 'g')
let files = 0
const hits = []
for (const r of roots) {
  for (const f of walk(r)) {
    files++
    const lines = readFileSync(f, 'utf8').split('\n')
    // 只查最外层 <template> … </template> 之间(SFC 的 template 块从行首开始)
    const start = lines.findIndex(l => /^<template[\s>]/.test(l))
    if (start < 0) continue
    let end = lines.length - 1
    for (let i = lines.length - 1; i > start; i--) if (/^<\/template>/.test(lines[i])) { end = i; break }
    for (let i = start + 1; i < end; i++) {
      const line = lines[i]
      if (line.includes('mk-allow-raw') || lines[i - 1].includes('mk-allow-raw')) continue
      for (const m of line.matchAll(TAG_RE)) {
        hits.push(`${relative(process.cwd(), f).split(sep).join("/")}:${i + 1}  <${m[1]}>  → ${BANNED[m[1]]}`)
      }
    }
  }
}

if (hits.length) {
  console.error(`✗ 原生元素 ${hits.length} 处(扫描 ${files} 个 .vue),改用组件库组件;确实要用的同一行或上一行写 mk-allow-raw 和原因:`)
  for (const h of hits) console.error('  ' + h)
  process.exit(1)
}
console.log(`✓ 原生元素检查通过(${files} 个 .vue)`)
