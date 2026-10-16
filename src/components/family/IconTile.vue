<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@mk/lib/utils'

/** 圆角方块里放一个图标:列表行左边、设置项左边。sm 40px / default 48px */
const props = withDefaults(defineProps<{ size?: 'sm' | 'default'; class?: HTMLAttributes['class'] }>(), {
  size: 'default',
})
</script>

<template>
  <span
    data-slot="icon-tile"
    :class="cn(
      'flex shrink-0 items-center justify-center rounded-xl bg-secondary/60',
      props.size === 'sm' ? 'size-10 [&_svg:not([class*=size-])]:size-5' : 'size-12 [&_svg:not([class*=size-])]:size-6',
      props.class,
    )"
  >
    <slot />
  </span>
</template>
