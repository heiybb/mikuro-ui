<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@mk/lib/utils'

/**
 * 首页大磁贴:图标在上、文字在下,按下微缩。默认渲染成 <button>;
 * 跳页面时 as-child 包一个 RouterLink。图标放默认插槽,文字用 label。
 */
const props = withDefaults(defineProps<PrimitiveProps & { label?: string; class?: HTMLAttributes['class'] }>(), {
  as: 'button',
})
</script>

<template>
  <Primitive
    data-slot="action-tile"
    :as="props.as"
    :as-child="props.asChild"
    :type="props.as === 'button' && !props.asChild ? 'button' : undefined"
    :class="cn(
      'flex flex-col items-center justify-center gap-2 rounded-3xl border bg-card px-2 py-4 text-center outline-none transition-transform duration-100',
      'active:scale-[0.97] active:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/50 [@media(hover:hover)]:hover:bg-secondary/40',
      'disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*=size-])]:size-8',
      props.class,
    )"
  >
    <slot />
    <span v-if="props.label" class="text-sm font-medium">{{ props.label }}</span>
  </Primitive>
</template>
