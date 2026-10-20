<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import type { ButtonVariants } from "."
import { Loader2Icon } from "@lucide/vue"
import { Primitive } from "reka-ui"
import { cn } from "@mk/lib/utils"
import { buttonVariants } from "."

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
  class?: HTMLAttributes["class"]
  /**
   * 提交中:转圈图标顶替按钮原有的图标,颜色不变灰(变灰像是"按不了",
   * 慢网络下用户分不清是没按到还是在处理),点击被吞掉防重复提交。
   * 文字由调用方换("保存中…"),库里不放文案
   */
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
  loading: false,
})

// 捕获阶段拦截:先于调用方挂在同一元素上的 @click 执行,stopImmediatePropagation 让它们都收不到。
// 不用 disabled:那会变灰,而且屏幕阅读器读成"不可用"而不是"忙"
function blockWhileLoading(e: Event) {
  if (!props.loading) return
  e.preventDefault()
  e.stopImmediatePropagation()
}
</script>

<template>
  <Primitive
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :data-loading="loading ? '' : undefined"
    :aria-busy="loading || undefined"
    :aria-disabled="loading || undefined"
    :as="as"
    :as-child="asChild"
    :class="cn(
      buttonVariants({ variant, size }),
      loading && 'cursor-progress [&_svg:not([data-slot=button-spinner])]:hidden',
      props.class,
    )"
    @click.capture="blockWhileLoading"
  >
    <!-- as-child 时插槽只能有一个子元素,不画转圈,只拦点击 -->
    <Loader2Icon v-if="loading && !asChild" data-slot="button-spinner" class="animate-spin" aria-hidden="true" />
    <slot />
  </Primitive>
</template>
