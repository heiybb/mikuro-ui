<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@mk/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <th
    data-slot="table-head"
    :class="cn('sticky top-0 z-10 bg-secondary text-muted-foreground h-10 px-3 text-left align-middle font-normal whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5', props.class)"
  >
    <slot />
  </th>
</template>
