<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'
import { ChevronRightIcon } from '@lucide/vue'
import { Primitive } from 'reka-ui'
import { cn } from '@mk/lib/utils'

/**
 * 卡片式列表行:左边 #leading(通常是 IconTile / 头像),中间标题 + 说明,右边 #trailing(金额、开关)。
 * 默认渲染成 <button>(可点);只展示不能点的传 as="div";跳页面 as-child 包 RouterLink。
 * chevron:右边画一个 ›,表示点进去还有一层。
 */
const props = withDefaults(
  defineProps<PrimitiveProps & {
    title?: string
    description?: string
    chevron?: boolean
    class?: HTMLAttributes['class']
  }>(),
  { as: 'button', chevron: false },
)
const interactive = computed(() => props.asChild || props.as !== 'div')
</script>

<template>
  <Primitive
    data-slot="list-row"
    :as="props.as"
    :as-child="props.asChild"
    :type="props.as === 'button' && !props.asChild ? 'button' : undefined"
    :class="cn(
      'flex w-full min-w-0 items-center gap-3 rounded-2xl border bg-card p-3 text-left outline-none',
      interactive && 'active:bg-secondary/50 focus-visible:ring-3 focus-visible:ring-ring/50 [@media(hover:hover)]:hover:bg-secondary/30 disabled:pointer-events-none disabled:opacity-50',
      props.class,
    )"
  >
    <slot name="leading" />
    <span class="min-w-0 flex-1">
      <slot>
        <span v-if="props.title" class="block truncate font-medium">{{ props.title }}</span>
        <span v-if="props.description" class="block truncate text-sm text-muted-foreground">{{ props.description }}</span>
      </slot>
    </span>
    <slot name="trailing" />
    <ChevronRightIcon v-if="props.chevron" class="size-4 shrink-0 text-muted-foreground" />
  </Primitive>
</template>
