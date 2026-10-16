<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner"
import { CircleCheckIcon, CircleXIcon, InfoIcon, Loader2Icon, TriangleAlertIcon, XIcon } from "@lucide/vue"
import { reactiveOmit } from "@vueuse/core"
import { Toaster as Sonner } from "vue-sonner"
import { cn } from "@mk/lib/utils"

/**
 * successIcon / errorIcon:app 自己的吉祥物图(手绘蜡笔风)。
 * 不传就用线性图标。图按 20px 显示,画的时候按这个尺寸看清晰度。
 */
const props = defineProps<ToasterProps & { successIcon?: string; errorIcon?: string }>()
const forwarded = reactiveOmit(props, "successIcon", "errorIcon", "class")
</script>

<template>
  <Sonner
    :class="cn('toaster group', props.class)"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',
    }"
    v-bind="forwarded"
  >
    <template #success-icon>
      <img v-if="props.successIcon" :src="props.successIcon" alt="" class="mk-toast-img size-5 shrink-0" />
      <CircleCheckIcon v-else class="size-4" />
    </template>
    <template #info-icon>
      <InfoIcon class="size-4" />
    </template>
    <template #warning-icon>
      <TriangleAlertIcon class="size-4" />
    </template>
    <template #error-icon>
      <img v-if="props.errorIcon" :src="props.errorIcon" alt="" class="mk-toast-img size-5 shrink-0" />
      <CircleXIcon v-else class="size-4" />
    </template>
    <template #loading-icon>
      <div>
        <Loader2Icon class="size-4 animate-spin" />
      </div>
    </template>
    <template #close-icon>
      <XIcon class="size-4" />
    </template>
  </Sonner>
</template>

<style>
/* sonner 把 [data-icon] 容器固定成 16px,会把手绘图标压成 16x20 变形;
   蜡笔笔触在 16px 下也糊,放到 20px。sonner 的样式是运行时注入的,
   排在打包 CSS 之后,同优先级下它会赢,所以这里必须 !important。
   只对放了图片的容器生效,线性图标保持 16px */
[data-sonner-toaster] [data-sonner-toast] [data-icon]:has(> .mk-toast-img) {
  width: 20px !important;
  height: 20px !important;
}
</style>
