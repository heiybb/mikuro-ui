#!/usr/bin/env node
// 调色板守卫:app 源码里不许写死 Mikuro 的颜色,一律引用令牌(bg-background、text-nav-active、var(--moon-accent)、
// rgb(var(--chart-2-rgb) / .4) …)。
//
// 用法(app build 开头跑,发现问题退出码 1):
//   bun node_modules/mikuro-ui/scripts/check-palette.mjs src index.html
//   bun node_modules/mikuro-ui/scripts/check-palette.mjs src --skip src/lib/import/__tests__
//
// 判定:
//   - 令牌文件 src/styles/tokens.css 里出现的每个十六进制色、每组 --*-rgb 三元组,都算「调色板色」(日间夜间两套都算);
//   - 另外带一份历史色值(换配色时被换掉的旧值),防止旧值被抄回来;
//   - 源码里出现这些色值的十六进制(#rrggbb / #rrggbbaa)或 rgb()/rgba() 三元组,就报出来;
//   - 同一行写了 mk-palette-literal 的:允许写「当前」调色板的字面值(index.html 的 theme-color、theme.ts 的状态栏色、
//     canvas 颜色常量),但旧色值照样报 —— 换配色时把旧值挪进下面的 LEGACY_*,这些字面值就会被逐个点出来;
//   - 同一行写了 mk-allow-color 的完全放行(与调色板无关、只是碰巧同色的地方,比如银行导出里的颜色字段)。
// 同时校验 tokens.css 自身:--chart-2-rgb 这类三元组必须和对应的十六进制令牌一致。
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const TOKENS = fileURLToPath(new URL('../src/styles/tokens.css', import.meta.url))
const EXT = new Set(['.css', '.scss', '.vue', '.ts', '.tsx', '.js', '.mjs', '.html', '.md', '.svg'])
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', '.build', 'cache', '.vitepress-cache'])
// 历史色值:换配色时被换掉的旧值(目前还没有)
const LEGACY_HEX = []
// LEGACY_HEX 的三元组会自动算进来;这里只列没有对应十六进制的
const LEGACY_RGB = []

const hexToRgb = h => [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)).join(',')

// ---- 读令牌:按规则块读(日间 :root、夜间 .dark 各一块),两套颜色都算调色板色
const tokenText = readFileSync(TOKENS, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
const hexTok = new Map()          // '6366f1' → '--chart-2'
const rgbTok = new Map()          // '99,102,241' → '--chart-2-rgb'
const blocks = []                 // [{ sel, hex: Map(name → hex), rgb: Map(name → 三元组) }]
for (const b of tokenText.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const blk = { sel: b[1].trim(), hex: new Map(), rgb: new Map() }
  for (const m of b[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    const [, name, val] = m
    const h = /^\s*#([0-9a-f]{6})\s*$/i.exec(val)
    if (h) blk.hex.set(name, h[1].toLowerCase())
    for (const x of val.matchAll(/#([0-9a-f]{6})\b/gi)) if (!hexTok.has(x[1].toLowerCase())) hexTok.set(x[1].toLowerCase(), name)
    const t = /^\s*(\d+)\s+(\d+)\s+(\d+)\s*$/.exec(val)
    if (t) { blk.rgb.set(name, `${t[1]},${t[2]},${t[3]}`); rgbTok.set(`${t[1]},${t[2]},${t[3]}`, name) }
  }
  blocks.push(blk)
}
// 自检:同一块里 --x-rgb 与 --x 一致(这一块没写 --x 时对照第一块,即日间 :root)
const problems = []
for (const blk of blocks) {
  for (const [name, trip] of blk.rgb) {
    const base = name.replace(/-rgb$/, '')
    const hex = blk.hex.get(base) ?? blocks[0]?.hex.get(base)
    if (!hex) problems.push(`tokens.css ${blk.sel}: ${name} 没有对应的十六进制令牌 ${base}`)
    else if (hexToRgb(hex) !== trip) problems.push(`tokens.css ${blk.sel}: ${name} = ${trip.replaceAll(',', ' ')},但 ${base} = #${hex}(${hexToRgb(hex).replaceAll(',', ' ')})`)
  }
}
const badHex = new Map(hexTok)
for (const h of LEGACY_HEX) if (!badHex.has(h)) badHex.set(h, '(旧色值)')
const badRgb = new Map()
for (const [h, n] of hexTok) badRgb.set(hexToRgb(h), n)
for (const [t, n] of rgbTok) badRgb.set(t, n)
for (const t of [...LEGACY_HEX.map(hexToRgb), ...LEGACY_RGB]) if (!badRgb.has(t)) badRgb.set(t, '(旧色值)')

// ---- 参数
const args = process.argv.slice(2)
const roots = [], skips = []
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--skip') skips.push(resolve(args[++i]))
  else roots.push(resolve(args[i]))
}
if (!roots.length) roots.push(resolve('src'))
const skipped = p => skips.some(s => p === s || p.startsWith(s + sep)) || p === TOKENS

function* walk(p) {
  if (skipped(p)) return
  const st = statSync(p)
  if (st.isDirectory()) {
    for (const n of readdirSync(p)) if (!SKIP_DIRS.has(n)) yield* walk(join(p, n))
  } else if (EXT.has(extname(p).toLowerCase()) && st.size < 3_000_000) yield p
}

const HEX_RE = /#([0-9a-fA-F]{6})(?:[0-9a-fA-F]{2})?\b/g
const RGB_RE = /rgba?\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})/g
let files = 0
const hits = []
for (const r of roots) {
  for (const f of walk(r)) {
    files++
    const lines = readFileSync(f, 'utf8').split('\n')
    lines.forEach((line, i) => {
      if (line.includes('mk-allow-color')) return
      const literal = line.includes('mk-palette-literal')   // 只报旧色值
      for (const m of line.matchAll(HEX_RE)) {
        const tok = badHex.get(m[1].toLowerCase())
        if (tok && !(literal && tok.startsWith('--'))) hits.push(`${relative(process.cwd(), f)}:${i + 1}  ${m[0]}  → ${tok}`)
      }
      for (const m of line.matchAll(RGB_RE)) {
        const tok = badRgb.get(`${+m[1]},${+m[2]},${+m[3]}`)
        if (tok && !(literal && tok.startsWith('--'))) hits.push(`${relative(process.cwd(), f)}:${i + 1}  ${m[0]}…  → ${tok}${tok.startsWith('--') && !tok.endsWith('-rgb') ? `(半透明写 color-mix(in srgb, var(${tok}) 40%, transparent),或者用 tokens.css 里的 -rgb 三元组)` : ''}`)
      }
    })
  }
}

for (const p of problems) console.error(`✗ ${p}`)
if (hits.length) {
  console.error(`✗ 写死的调色板颜色 ${hits.length} 处(扫描 ${files} 个文件),改成令牌引用;确实不能用 CSS 变量的行加注释 mk-allow-color:`)
  for (const h of hits) console.error('  ' + h)
}
if (problems.length || hits.length) process.exit(1)
console.log(`✓ 调色板检查通过(${files} 个文件)`)
