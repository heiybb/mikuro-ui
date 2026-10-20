<script setup lang="ts">
import type { ProgressRootProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { ProgressIndicator, ProgressRoot } from "reka-ui"
import { cn } from "@mk/lib/utils"

/** 进度条。modelValue 0–max(默认 100);null 表示进度未知(Reka 的 indeterminate) */
const props = withDefaults(
  defineProps<ProgressRootProps & { class?: HTMLAttributes["class"] }>(),
  { modelValue: 0 },
)

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <ProgressRoot
    data-slot="progress"
    v-bind="delegatedProps"
    :class="cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', props.class)"
  >
    <ProgressIndicator
      data-slot="progress-indicator"
      class="h-full w-full flex-1 rounded-full bg-primary transition-transform duration-300"
      :style="`transform: translateX(-${100 - ((props.modelValue ?? 0) / (props.max ?? 100)) * 100}%);`"
    />
  </ProgressRoot>
</template>
