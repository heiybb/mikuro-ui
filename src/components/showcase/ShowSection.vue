<script setup lang="ts">
defineProps<{ title: string; note?: string }>()
</script>

<template>
  <section class="flex scroll-mt-20 flex-col gap-3">
    <div>
      <h2 class="text-lg font-bold">{{ title }}</h2>
      <p v-if="note" class="text-sm text-muted-foreground">{{ note }}</p>
    </div>
    <slot />
  </section>
</template>
