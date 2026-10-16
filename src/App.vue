<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import {
  CalendarIcon, ImageIcon, MoonIcon, NotebookPenIcon, PlusIcon, SearchIcon, SunIcon, WalletIcon,
} from '@lucide/vue'
import ShowSection from './components/showcase/ShowSection.vue'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
  Avatar, AvatarFallback, AvatarImage, Badge, Button,
  Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogScrollContent, DialogTitle, DialogTrigger,
  Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger,
  Input, Label, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue,
  Separator, Slider, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Tabs, TabsContent, TabsList, TabsTrigger, Textarea, Toaster, Toggle, ToggleGroup, ToggleGroupItem,
  ActionTile, IconTile, ListRow,
} from './index'

// ?theme=dark|light 固定主题;?open=dialog|scroll|alert|drawer|select 打开对应弹层(截图检查用)
const params = new URLSearchParams(location.search)
const dark = ref(params.get('theme') ? params.get('theme') === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches)
watch(dark, (v) => document.documentElement.classList.toggle('dark', v), { immediate: true })
const openParam = params.get('open')
const dialogOpen = ref(openParam === 'dialog')
const scrollOpen = ref(openParam === 'scroll')
const alertOpen = ref(openParam === 'alert')
const drawerOpen = ref(openParam === 'drawer')
// ?only=<节 id>[,<节 id>…] 只渲染这几节(单独检查某个组件;?open=select 时默认只看下拉那一节)
const only = (params.get('only') ?? (openParam === 'select' ? 'select' : '')).split(',').filter(Boolean)
const show = (id: string) => only.length === 0 || only.includes(id)

const sections = [
  ['tokens', '令牌'], ['type', '文字'], ['button', '按钮'], ['badge', '徽章'], ['input', '输入框'],
  ['select', '下拉'], ['slider', '滑块'], ['toggle', '开关按钮'], ['tabs', '标签页'], ['card', '卡片'],
  ['avatar', '头像'], ['separator', '分隔线'], ['dialog', '对话框'], ['alert', '确认框'], ['drawer', '抽屉'],
  ['toast', '提示'], ['patterns', '家庭组件'], ['toolbar', '筛选条与表格'],
] as const

// 色板只列令牌名,色块直接用 var(),源码里不出现色值
const swatchGroups: Array<{ title: string; names: string[] }> = [
  {
    title: '基础',
    names: ['background', 'foreground', 'card', 'primary', 'primary-foreground', 'secondary', 'muted-foreground', 'border', 'ring', 'destructive'],
  },
  { title: '导航', names: ['nav-bg', 'nav-border', 'nav-inactive', 'nav-inactive-strong', 'nav-active', 'nav-active-bg', 'nav-hover-bg'] },
  { title: '月光', names: ['moon-bg-from', 'moon-bg', 'moon-bg-to', 'moon-border', 'moon-accent', 'moon-text', 'moon-muted', 'moon-well'] },
  { title: '图表', names: ['chart-1', 'chart-2', 'chart-3'] },
  { title: '滚动条', names: ['scrollbar-thumb', 'scrollbar-thumb-hover'] },
]

const volume = ref([40])
const range = ref([20, 70])
const unit = ref('ml')
const weekdays = ref<string[]>(['一', '三'])
// 「全部」用哨兵值 'all':Reka 的 SelectItem 不许空串当值,null 又会和「没选」分不清
const kind = ref<string>('all')
const category = ref<number | 'all'>('all')
const pickedCategory = ref<number>()
const longPick = ref('long')
const formPick = ref('b')
const categories = [
  { id: 1, name: '餐饮' }, { id: 2, name: '日用' }, { id: 3, name: '交通' }, { id: 4, name: '水电煤网' },
]
// 头像图:一张画在 SVG 里的剪影,不依赖外部文件
const avatarSrc = computed(() =>
  'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="gray" opacity=".25"/><circle cx="20" cy="16" r="7" fill="gray" opacity=".7"/><rect x="8" y="26" width="24" height="14" rx="7" fill="gray" opacity=".7"/></svg>',
  ),
)
const rows = [
  { date: '10-15', kind: '支出', cat: '餐饮', who: '甲', amount: '-$12.34' },
  { date: '10-14', kind: '收入', cat: '工资', who: '乙', amount: '+$1,000.00' },
  { date: '10-12', kind: '转账', cat: '', who: '甲', amount: '$200.00' },
]
</script>

<template>
  <div class="min-h-dvh bg-background">
    <header class="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <h1 class="text-2xl font-bold">Mikuro UI</h1>
        <span class="hidden text-sm text-muted-foreground sm:inline">家庭 app 组件库 · 全部组件</span>
        <Button variant="outline" size="icon" class="ml-auto" :aria-label="dark ? '切到日间' : '切到夜间'" @click="dark = !dark">
          <SunIcon v-if="dark" />
          <MoonIcon v-else />
        </Button>
      </div>
    </header>

    <div class="mx-auto flex max-w-6xl gap-8 px-4">
      <nav class="sticky top-16 hidden h-[calc(100dvh-4rem)] w-40 shrink-0 flex-col gap-0.5 overflow-y-auto py-6 lg:flex" aria-label="目录">
        <a
          v-for="[id, label] in sections"
          :key="id"
          :href="`#${id}`"
          class="rounded-lg px-3 py-1.5 text-sm text-nav-inactive-strong hover:bg-nav-hover"
        >{{ label }}</a>
      </nav>

      <main class="flex min-w-0 max-w-3xl flex-1 flex-col gap-12 py-6">
        <ShowSection v-if="show('tokens')" id="tokens" title="令牌" note="左日间、右夜间。改颜色只改 src/styles/tokens.css">
          <div class="grid gap-3 sm:grid-cols-2">
            <div v-for="mode in ['light', 'dark']" :key="mode" :class="mode" class="flex flex-col gap-4 rounded-2xl border bg-background p-4 text-foreground">
              <div v-for="g in swatchGroups" :key="g.title">
                <div class="mb-1.5 text-xs font-medium text-muted-foreground">{{ g.title }}</div>
                <div class="grid grid-cols-2 gap-1.5">
                  <div v-for="n in g.names" :key="n" class="flex items-center gap-2 text-xs">
                    <span class="size-6 shrink-0 rounded-md border" :style="{ background: `var(--${n})` }" />
                    <code class="truncate">--{{ n }}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ShowSection>

        <ShowSection v-if="show('type')" id="type" title="文字" note="MiSans 400 / 500 / 600 / 700;金额一律 tabular-nums">
          <div class="flex flex-col gap-2 rounded-2xl border bg-card p-4">
            <div class="text-3xl font-bold">页标题 text-3xl</div>
            <div class="text-2xl font-bold">页标题 text-2xl</div>
            <div class="text-lg font-semibold">区块标题 text-lg 600</div>
            <div class="text-base">正文 text-base 400,一行写不下时自然换行,看看中文和 English 混排的样子。</div>
            <div class="text-sm text-muted-foreground">次要说明 text-sm muted</div>
            <div class="text-xs text-muted-foreground">最小标注 text-xs</div>
            <div class="text-2xl font-bold tabular-nums">$1,234.56 · $9,876.10</div>
          </div>
        </ShowSection>

        <ShowSection v-if="show('button')" id="button" title="按钮">
          <div class="flex flex-wrap items-center gap-2">
            <Button>保存</Button>
            <Button variant="secondary">次要</Button>
            <Button variant="outline">描边</Button>
            <Button variant="ghost">幽灵</Button>
            <Button variant="destructive">删除</Button>
            <Button variant="link">链接</Button>
            <Button disabled>禁用</Button>
            <Button variant="outline" disabled>禁用描边</Button>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <Button size="xs">xs</Button>
            <Button size="sm">sm</Button>
            <Button>default</Button>
            <Button size="lg">lg</Button>
            <Button size="icon-xs" variant="outline" aria-label="加"><PlusIcon /></Button>
            <Button size="icon-sm" variant="outline" aria-label="加"><PlusIcon /></Button>
            <Button size="icon" variant="outline" aria-label="加"><PlusIcon /></Button>
            <Button size="icon-lg" variant="outline" aria-label="加"><PlusIcon /></Button>
            <Button><PlusIcon />带图标</Button>
          </div>
          <Button size="lg" class="h-12 w-full text-lg">drawer 底部主按钮(现在 app 里的写法)</Button>
        </ShowSection>

        <ShowSection v-if="show('badge')" id="badge" title="徽章">
          <div class="flex flex-wrap gap-2">
            <Badge>默认</Badge>
            <Badge variant="secondary">次要</Badge>
            <Badge variant="outline">描边</Badge>
            <Badge variant="destructive">警示</Badge>
          </div>
        </ShowSection>

        <ShowSection v-if="show('input')" id="input" title="输入框">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-2">
              <Label for="sc-amount">金额</Label>
              <Input id="sc-amount" inputmode="decimal" placeholder="0.00" />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="sc-bad">出错的输入框</Label>
              <Input id="sc-bad" aria-invalid="true" model-value="abc" />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="sc-dis">禁用</Label>
              <Input id="sc-dis" disabled model-value="不能改" />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="sc-date">日期(原生)</Label>
              <Input id="sc-date" type="date" model-value="2026-01-01" />
            </div>
            <div class="flex flex-col gap-2 sm:col-span-2">
              <Label for="sc-note">备注</Label>
              <Textarea id="sc-note" placeholder="写点什么…" />
            </div>
          </div>
        </ShowSection>

        <ShowSection v-if="show('select')" id="select" title="下拉" note="Select(Reka UI):箭头离右边 12px。sm 给筛选条,default 给表单。「全部」用哨兵值 'all',不用空串和 null">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-2">
              <Label>sm(筛选条)</Label>
              <Select v-model="kind" :default-open="openParam === 'select'">
                <SelectTrigger size="sm" class="w-full" aria-label="类型"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="expense">支出</SelectItem>
                  <SelectItem value="income">收入</SelectItem>
                  <SelectItem value="transfer">转账</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex flex-col gap-2">
              <Label>default(表单)</Label>
              <Select v-model="formPick">
                <SelectTrigger class="w-full" aria-label="示例"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">选项 A</SelectItem>
                  <SelectItem value="b">选项 B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex flex-col gap-2">
              <Label>数字值 + 「全部」</Label>
              <Select v-model="category">
                <SelectTrigger size="sm" class="w-full" aria-label="分类"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  <SelectSeparator />
                  <SelectItem v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</SelectItem>
                </SelectContent>
              </Select>
              <span class="text-xs text-muted-foreground">当前值:{{ category }}({{ typeof category }})</span>
            </div>
            <div class="flex flex-col gap-2">
              <Label>没选时显示占位</Label>
              <Select v-model="pickedCategory">
                <SelectTrigger class="w-full" aria-label="分类"><SelectValue placeholder="选分类" /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>支出</SelectLabel>
                    <SelectItem v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div class="flex flex-col gap-2">
              <Label>长选项(窄容器)</Label>
              <Select v-model="longPick">
                <SelectTrigger size="sm" class="w-40" aria-label="长选项"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="long">一个特别特别长的选项名字会被截断</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex flex-col gap-2">
              <Label>禁用 / 出错</Label>
              <div class="flex gap-2">
                <Select model-value="x" disabled>
                  <SelectTrigger size="sm" aria-label="禁用"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="x">不能选</SelectItem></SelectContent>
                </Select>
                <Select model-value="x">
                  <SelectTrigger size="sm" aria-invalid="true" aria-label="出错"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="x">选错了</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </ShowSection>

        <ShowSection v-if="show('slider')" id="slider" title="滑块" note="拇指 28px,方便单手拖">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-2">
              <Label>单值 {{ volume[0] }}</Label>
              <Slider v-model="volume" :max="100" :step="1" />
            </div>
            <div class="flex flex-col gap-2">
              <Label>区间 {{ range[0] }} – {{ range[1] }}</Label>
              <Slider v-model="range" :max="100" :step="5" />
            </div>
          </div>
        </ShowSection>

        <ShowSection v-if="show('toggle')" id="toggle" title="开关按钮">
          <div class="flex flex-col gap-3">
            <ToggleGroup v-model="unit" type="single" variant="outline">
              <ToggleGroupItem value="ml">ml</ToggleGroupItem>
              <ToggleGroupItem value="oz">oz</ToggleGroupItem>
              <ToggleGroupItem value="min">分钟</ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup v-model="weekdays" type="multiple">
              <ToggleGroupItem v-for="d in ['一', '二', '三', '四', '五', '六', '日']" :key="d" :value="d">{{ d }}</ToggleGroupItem>
            </ToggleGroup>
            <div class="flex items-center gap-2">
              <Toggle aria-label="夜间"><MoonIcon /></Toggle>
              <Toggle variant="outline" aria-label="日间"><SunIcon /></Toggle>
              <Toggle variant="outline" :default-value="true" aria-label="已按下">已按下</Toggle>
            </div>
          </div>
        </ShowSection>

        <ShowSection v-if="show('tabs')" id="tabs" title="标签页">
          <Tabs default-value="day" class="w-full">
            <TabsList>
              <TabsTrigger value="day">日</TabsTrigger>
              <TabsTrigger value="week">周</TabsTrigger>
              <TabsTrigger value="month">月</TabsTrigger>
              <TabsTrigger value="off" disabled>禁用</TabsTrigger>
            </TabsList>
            <TabsContent value="day" class="text-sm text-muted-foreground">今天的内容</TabsContent>
            <TabsContent value="week" class="text-sm text-muted-foreground">这周的内容</TabsContent>
            <TabsContent value="month" class="text-sm text-muted-foreground">这个月的内容</TabsContent>
          </Tabs>
        </ShowSection>

        <ShowSection v-if="show('card')" id="card" title="卡片" note="shadcn 原版 Card(rounded-xl + 阴影)。app 里实际的卡片多是「常见写法」那种">
          <Card>
            <CardHeader>
              <CardTitle>示例统计</CardTitle>
              <CardDescription>卡片说明文字</CardDescription>
              <CardAction><Button variant="outline" size="sm">操作</Button></CardAction>
            </CardHeader>
            <CardContent class="text-3xl font-bold tabular-nums">$1,234.56</CardContent>
            <CardFooter class="text-sm text-muted-foreground">卡片底部</CardFooter>
          </Card>
        </ShowSection>

        <ShowSection v-if="show('avatar')" id="avatar" title="头像">
          <div class="flex items-center gap-2">
            <Avatar><AvatarImage :src="avatarSrc" alt="示例" /><AvatarFallback>甲</AvatarFallback></Avatar>
            <Avatar><AvatarFallback>甲</AvatarFallback></Avatar>
            <Avatar><AvatarFallback>B</AvatarFallback></Avatar>
            <Avatar class="size-12"><AvatarFallback>大</AvatarFallback></Avatar>
          </div>
        </ShowSection>

        <ShowSection v-if="show('separator')" id="separator" title="分隔线">
          <div class="rounded-2xl border bg-card p-4 text-sm">
            <div>上面</div>
            <Separator class="my-3" />
            <div class="flex h-5 items-center gap-3">左<Separator orientation="vertical" />中<Separator orientation="vertical" />右</div>
          </div>
        </ShowSection>

        <ShowSection v-if="show('dialog')" id="dialog" title="对话框" note="?open=dialog / ?open=scroll 直接打开">
          <div class="flex flex-wrap gap-2">
            <Dialog v-model:open="dialogOpen">
              <DialogTrigger as-child><Button variant="outline">对话框</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>选择日期</DialogTitle>
                  <DialogDescription>日期选择、确认类的小弹窗都是这个壳</DialogDescription>
                </DialogHeader>
                <Select v-model="formPick">
                  <SelectTrigger class="w-full" aria-label="示例"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">选项 A</SelectItem>
                    <SelectItem value="b">选项 B</SelectItem>
                  </SelectContent>
                </Select>
                <DialogFooter><Button size="lg" class="h-12 w-full text-lg">确定</Button></DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog v-model:open="scrollOpen">
              <DialogTrigger as-child><Button variant="outline">长内容对话框</Button></DialogTrigger>
              <DialogScrollContent>
                <DialogHeader>
                  <DialogTitle>长内容</DialogTitle>
                  <DialogDescription>内容超出一屏时整个弹窗跟着页面滚</DialogDescription>
                </DialogHeader>
                <p v-for="i in 30" :key="i" class="text-sm">第 {{ i }} 行内容</p>
              </DialogScrollContent>
            </Dialog>
          </div>
        </ShowSection>

        <ShowSection v-if="show('alert')" id="alert" title="确认框" note="?open=alert 直接打开">
          <AlertDialog v-model:open="alertOpen">
            <AlertDialogTrigger as-child><Button variant="outline" class="w-fit">删除…</Button></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>删除这条记录?</AlertDialogTitle>
                <AlertDialogDescription>删掉的记录可以在回收站里找回。</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction>删除</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ShowSection>

        <ShowSection v-if="show('drawer')" id="drawer" title="抽屉" note="手机上的编辑都在底部抽屉里。?open=drawer 直接打开">
          <Drawer v-model:open="drawerOpen">
            <DrawerTrigger as-child><Button variant="outline" class="w-fit">底部抽屉</Button></DrawerTrigger>
            <DrawerContent>
              <div class="mx-auto w-full max-w-md">
                <DrawerHeader>
                  <DrawerTitle>记一笔</DrawerTitle>
                  <DrawerDescription>表单控件放在抽屉里的样子</DrawerDescription>
                </DrawerHeader>
                <div class="flex flex-col gap-3 px-4">
                  <Input placeholder="金额" inputmode="decimal" />
                  <Select v-model="pickedCategory">
                    <SelectTrigger class="w-full" aria-label="分类"><SelectValue placeholder="选分类" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DrawerFooter>
                  <Button size="lg" class="h-12 w-full text-lg">保存</Button>
                  <DrawerClose as-child><Button variant="ghost">取消</Button></DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </ShowSection>

        <ShowSection v-if="show('toast')" id="toast" title="提示" note="successIcon / errorIcon 传 app 自己的吉祥物图;不传是线性图标">
          <div class="flex flex-wrap gap-2">
            <Button variant="outline" @click="toast.success('已保存')">成功</Button>
            <Button variant="outline" @click="toast.error('保存失败,网络断了')">失败</Button>
            <Button variant="outline" @click="toast.info('有 3 条待确认')">信息</Button>
            <Button variant="outline" @click="toast.warning('这张账单还没付')">警告</Button>
            <Button variant="outline" @click="toast.loading('正在上传…')">加载中</Button>
          </div>
        </ShowSection>

        <ShowSection v-if="show('patterns')" id="patterns" title="家庭组件" note="ActionTile 首页磁贴 / ListRow 列表行 / IconTile 图标方块">
          <div class="grid grid-cols-3 gap-3">
            <ActionTile label="记一笔"><NotebookPenIcon /></ActionTile>
            <ActionTile label="日程"><CalendarIcon /></ActionTile>
            <ActionTile label="相册"><ImageIcon /></ActionTile>
          </div>
          <div class="flex flex-col gap-2">
            <ListRow v-for="i in 2" :key="i" :title="`示例商家 ${i}`" description="分类 · 日期" chevron>
              <template #leading><IconTile><WalletIcon /></IconTile></template>
              <template #trailing><span class="font-medium tabular-nums">-$12.34</span></template>
            </ListRow>
            <ListRow as="div" title="只展示、不能点" description="as=&quot;div&quot;">
              <template #leading><IconTile size="sm"><CalendarIcon /></IconTile></template>
            </ListRow>
          </div>
          <div class="rounded-2xl border border-moon-border p-4 text-moon-text" style="background: linear-gradient(145deg, var(--moon-bg-from) 0%, var(--moon-bg) 68%, var(--moon-bg-to) 100%)">
            <div class="text-sm text-moon-muted">月光面板</div>
            <div class="text-2xl font-bold tabular-nums">进行中 1:24</div>
          </div>
        </ShowSection>

        <ShowSection v-if="show('toolbar')" id="toolbar" title="筛选条与表格" note="桌面端列表页的样子:一排 sm 下拉 + 搜索 + 表格">
          <div class="flex flex-wrap items-center gap-2">
            <Select v-model="kind">
              <SelectTrigger size="sm" aria-label="类型"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="expense">支出</SelectItem>
                <SelectItem value="income">收入</SelectItem>
              </SelectContent>
            </Select>
            <Select v-model="category">
              <SelectTrigger size="sm" aria-label="分类"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</SelectItem>
              </SelectContent>
            </Select>
            <Select model-value="all">
              <SelectTrigger size="sm" aria-label="账户"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">全部账户</SelectItem></SelectContent>
            </Select>
            <div class="relative w-full sm:w-64">
              <SearchIcon class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input class="h-9 pl-8 text-sm" placeholder="搜备注 / 商家" />
            </div>
          </div>
          <Table container-class="rounded-2xl border bg-card max-h-64">
            <TableHeader>
              <TableRow>
                <TableHead>日期</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>记录人</TableHead>
                <TableHead class="text-right">金额</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="r in rows" :key="r.date">
                <TableCell class="tabular-nums">{{ r.date }}</TableCell>
                <TableCell>{{ r.kind }}</TableCell>
                <TableCell>{{ r.cat || '—' }}</TableCell>
                <TableCell>{{ r.who }}</TableCell>
                <TableCell class="text-right font-medium tabular-nums">{{ r.amount }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ShowSection>

        <Separator />
        <p class="pb-8 text-center text-xs text-muted-foreground">mikuro-ui</p>
      </main>
    </div>
    <Toaster position="top-center" :theme="dark ? 'dark' : 'light'" />
  </div>
</template>
