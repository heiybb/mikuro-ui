# Mikuro UI

家庭 web app 共用的 Vue 组件库。日间暖米 / 夜间深蓝,圆角、大触控区,手机优先、桌面兼顾。
shadcn-vue 的组件结构 + Reka UI 的交互与无障碍 + Tailwind v4,源码直接参与 app 编译,不单独打包。

```bash
bun install
bun run dev      # 展示页 http://localhost:5173
bun run build    # 守卫检查 + 类型检查 + 构建
```

## 展示页

`bun run dev` 打开的页面列出全部组件和变体,改组件后先在这里看。URL 参数(截图检查用):

| 参数 | 作用 |
|---|---|
| `?theme=light` / `?theme=dark` | 固定日间 / 夜间 |
| `?only=select,toolbar` | 只渲染这几节(节 id 见左侧目录) |
| `?open=dialog` / `scroll` / `alert` / `drawer` / `select` | 直接打开对应弹层 |

展示页用的 MiSans 字体放在 `public/fonts/`(不进仓库,见下方「字体」),没有时回落系统字体。

## 结构

| 路径 | 作用 |
|---|---|
| `src/styles/tokens.css` | 全部颜色的唯一来源(日间 `:root` / 夜间 `.dark`) |
| `src/styles/theme.css` | 令牌 + 字体 → Tailwind 颜色 / 圆角 / 字体栈(`@theme inline`),app 必引 |
| `src/styles/fonts.css` | MiSans 的 `@font-face`,指向 app 的 `/fonts/`,theme.css 已引 |
| `src/styles/base.css` | 页面底色、触摸行为、横向溢出裁剪、滚动条,app 必引 |
| `src/components/ui/*` | shadcn-vue 组件(按下面的约定改过外观) |
| `src/components/family/*` | 家庭组件:shadcn 没有、几个 app 都在用的写法 |
| `src/index.ts` | 统一入口:全部组件 + `cn` |
| `scripts/check-palette.mjs` | 调色板守卫 |
| `scripts/check-raw-html.mjs` | 原生元素守卫 |

组件内部统一用 `@mk/` 导入。加 shadcn 组件:`bunx --bun shadcn-vue@latest add <名字>`,拉下来后:
CLI 生成的 `import { cn } from "cn"` 改成 `@mk/lib/utils`,并把它顺手加进 package.json 的 `cn` 依赖删掉;
它还会擅自升级 `@vueuse/core` / `reka-ui`,改回和 app 一致的版本。

## 组件约定

**不在 app 里写原生表单元素。** `<input> <select> <textarea> <button> <label> <table>` 一律用组件
(Input / Select / Textarea / Button 或家庭组件 / Label / Table),外观、触控区、夜间配色才统一。
`check-raw-html.mjs` 在 build 时检查;确实要原生元素的(隐藏的 `<input type="file">` 之类),同一行或上一行写 `mk-allow-raw` 和原因。
也不用 shadcn 的 `Native*` 组件。

| 组件 | 说明 |
|---|---|
| Select | `SelectTrigger size="sm"`(h-9,筛选条)/ 默认(h-11,表单);箭头离右边 12px。「全部」用哨兵值 `'all'`:Reka 的 SelectItem 不许空串当值,null 又和「没选」分不清 |
| Table | `container-class` 加在外层滚动容器上(圆角卡片底、`max-h-*` 限高);表头 sticky、`bg-secondary` |
| Toaster | `success-icon` / `error-icon` 传 app 自己的吉祥物图(手绘蜡笔风,按 20px 显示);不传是线性图标 |
| ActionTile | 首页大磁贴:图标插槽 + `label`,按下微缩;`as-child` 包 RouterLink 跳页面 |
| ListRow | 卡片式列表行:`#leading`(IconTile / 头像)+ `title` / `description` + `#trailing`,`chevron` 画 ›;`as="div"` 为只展示 |
| IconTile | 圆角方块装图标,`size="sm"` 40px / 默认 48px |

## 令牌

变量名沿用 shadcn 的语义名(`--background`、`--primary` …),所以 `bg-background`、`text-muted-foreground` 这些类直接能用。另有:

| 组 | 令牌 | Tailwind 类 |
|---|---|---|
| 导航 | `--nav-bg / -border / -inactive / -inactive-strong / -active / -active-bg / -hover-bg` | `bg-nav`、`text-nav-active`、`bg-nav-active-bg` … |
| 月光 | `--moon-bg-from / -bg / -bg-to / -border / -accent / -text / -muted / -well` | `bg-moon`、`border-moon-border`、`text-moon-muted` … |
| 图表 | `--chart-1..3`(明暗两底对比度都 ≥ 3:1),`--chart-2-rgb` | `bg-chart-1` … |
| 滚动条 | `--scrollbar-thumb / -hover` | (base.css 用) |

- 夜间:`<html class="dark">`。局部固定配色:容器加 `class="dark"` 整块走夜间,夜间页面里要保持日间的区域加 `class="light"`。
  `.light` 只换令牌,Tailwind 的 `dark:` 变体仍按 `<html>` 判断。
- 半透明:Tailwind 写 `bg-primary/10`;普通 CSS 写 `color-mix(in srgb, var(--x) 40%, transparent)`,或用 `-rgb` 三元组 `rgb(var(--chart-2-rgb) / .4)`(缺哪个就在 tokens.css 补)。
- canvas / JS 里要颜色:运行时读 `getComputedStyle(document.documentElement).getPropertyValue('--chart-1')`。

## 圆角

`--radius` = 10px。控件 `rounded-lg` / `rounded-xl`,卡片和列表行 `rounded-2xl`,首页大磁贴 `rounded-3xl`,选择胶囊 `rounded-full`。

## 字体

MiSans(小米,免费商用;嵌入使用时要在 app 里注明用了 MiSans)。官方协议没写明能否单独再分发字体文件,
所以**字体文件不进本仓库**:各 app 自己放 `public/fonts/misans-{400,500,600,700}.woff2`(建议 GB2312 常用集子集,每档约 900KB),
`fonts.css` 指向 `/fonts/…`。PWA 的 workbox `globPatterns` 要包含 `woff2`。

## 在 app 中使用

公开仓库,按 tag 固定版本。改库不会让另一个 app 下次 deploy 时悄悄跟着变,升级要在 app 里显式改 tag。

### 1. 依赖

```jsonc
// app 的 package.json
"dependencies": {
  "mikuro-ui": "github:heiybb/mikuro-ui#v0.1.0",
  // 库的 peerDependencies 由 app 提供(全站只有一份):
  "vue": "^3.5", "reka-ui": "^2.10", "@vueuse/core": "^14", "vue-sonner": "^2"
}
```

### 2. vite、tsconfig 与 CSS

```ts
// vite.config.ts
resolve: {
  alias: { '@mk': fileURLToPath(new URL('./node_modules/mikuro-ui/src', import.meta.url)) },
  dedupe: ['vue', 'reka-ui', '@vueuse/core', 'vue-sonner'],
},
```

tsconfig.app.json 的 `paths` 加 `"@mk/*": ["./node_modules/mikuro-ui/src/*"]`。

```css
/* app 的 CSS 入口(路径相对于这个 CSS 文件) */
@import "tailwindcss";
@import "tw-animate-css";
@import "../../node_modules/mikuro-ui/src/styles/theme.css";
@import "../../node_modules/mikuro-ui/src/styles/base.css";
@source "../../node_modules/mikuro-ui/src/components";   /* Tailwind 默认不扫 node_modules */
```

### 3. 守卫

app 的 build 开头跑:

```bash
bun node_modules/mikuro-ui/scripts/check-palette.mjs src index.html
bun node_modules/mikuro-ui/scripts/check-raw-html.mjs src
```

调色板:确实不能用 CSS 变量的地方(`index.html` 的 `theme-color`、换状态栏颜色的常量)照写当前色值,行尾注释 `mk-palette-literal`;
和调色板无关、只是碰巧同色的标 `mk-allow-color`。
换配色:改 tokens.css → 把旧值加进 check-palette.mjs 的 `LEGACY_HEX` → 发版 → app 升 tag,标了 `mk-palette-literal` 的旧值会被逐个点出来。

### 4. 发版与升级

- 库:提交 → `git tag -a v0.x.y -m v0.x.y && git push origin main v0.x.y`。
- app:改 package.json 里的 tag → `bun install` → 构建、截图核对。
- 本地联调:app 里临时 `bun link` 到本地的 mikuro-ui,验证完改回 tag。

## 路线

1. ✅ 令牌、字体、base、基础组件;Select / Table;ActionTile / ListRow / IconTile;两个守卫
2. 第一个 app 迁移:换掉全部原生元素,导航改走令牌
3. 更多家庭组件:AppShell、BottomNav / SideNav、PageHeader、PillSelect、WheelPicker / DatePickerDialog、MemberAvatar、InstallHint、EmptyState / StatTile;
   工具:useModalBack、createTheme、isDesktop、compressImage;文案用 `provideMikuroLabels` 注入
4. 基础组件默认值:Button `size="touch"`、Card 改 `rounded-2xl` 去阴影
5. 设计规范技能
