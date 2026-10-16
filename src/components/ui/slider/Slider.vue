<script setup lang="ts">
import type { SliderRootEmits, SliderRootProps } from 'reka-ui'
import { reactiveOmit } from '@vueuse/core'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack, useForwardPropsEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@mk/lib/utils'

/**
 * 用 reka-ui 的 Slider 而不是原生 <input type="range">:
 * 后者的拖动交给 WebKit 默认触摸处理,在 iOS 上时灵时不灵(实测只能点、
 * 不能拖);这个是纯 pointer 事件实现,行为在各平台一致、可控。
 */
const props = defineProps<SliderRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<SliderRootEmits>()
const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <SliderRoot
    v-bind="forwarded"
    :class="cn('relative flex w-full touch-none select-none items-center py-3', props.class)"
  >
    <SliderTrack class="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderRange class="absolute h-full bg-foreground" />
    </SliderTrack>
    <!-- 拇指做大一点(28px):单手操作时小圆点很难抓准 -->
    <SliderThumb
      v-for="(_, i) in (props.modelValue ?? [0])"
      :key="i"
      class="block size-7 rounded-full border-2 border-foreground bg-card shadow transition-transform active:scale-110"
    />
  </SliderRoot>
</template>
