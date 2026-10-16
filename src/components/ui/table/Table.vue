<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@mk/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  /** 外层滚动容器的 class:圆角卡片底、限高滚动(配合表头 sticky)都加在这里 */
  containerClass?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div data-slot="table-container" :class="cn('relative w-full overflow-auto', props.containerClass)">
    <table data-slot="table" :class="cn('w-full caption-bottom text-sm', props.class)">
      <slot />
    </table>
  </div>
</template>
