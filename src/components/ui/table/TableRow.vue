<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@mk/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <tr
    data-slot="table-row"
    :class="cn('hover:bg-secondary/40 data-[state=selected]:bg-secondary/60 border-b transition-colors', props.class)"
  >
    <slot />
  </tr>
</template>
