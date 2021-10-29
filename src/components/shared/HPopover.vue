<script lang="ts" setup>
import { createPopper, Instance, PositioningStrategy } from '@popperjs/core'
import { ref, onMounted, watch, defineComponent, computed } from 'vue';
import { Placement } from '@popperjs/core/lib/enums';
defineComponent({
  inheritAttrs: false,
})
const props = defineProps<{
  placement?: Placement,
  strategy?: PositioningStrategy,
  openOnHover?: boolean
  open?: boolean
  offsetX?: number
  offsetY?: number
}>()
const target = ref<HTMLElement | undefined>(undefined)
const content = ref<HTMLElement | undefined>(undefined)
const instance = ref<Instance | undefined>(undefined)
onMounted(() => {
  instance.value = createPopper(target.value!, content.value!, {
    strategy: props.strategy || "fixed",
    placement: props.placement || "auto",
    modifiers: [{
      name: 'offset',
      options: {
        offset: [props.offsetX ?? 0, props.offsetY ?? 8],
      }
    }]
  })
})
watch(props, () => instance.value?.update())
</script>

<template>
  <div ref="target" v-bind="$attrs" class="target">
    <slot />
  </div>
  <div ref="content" class="content" :class="{ open, openOnHover }">
    <div class="inner-box">
      <slot name="content" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.content {
  @apply invisible;
  & > .inner-box {
    @apply transition duration-300 transform -translate-x-1;
  }
}

.open {
  @apply visible translate-x-0;
  & > .inner-box {
    @apply translate-x-0;
  }
}

.target:hover {
  & + .openOnHover {
    @apply visible;
    & > .inner-box {
      @apply translate-x-0;
    }
  }
}
</style>