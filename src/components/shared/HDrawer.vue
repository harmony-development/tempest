<script lang="ts" setup>
import { useVModel } from "@vueuse/core";
import { defineComponent, defineProps } from "vue";
defineComponent({
  inheritAttrs: false,
});
const props = defineProps<{
  modelValue: boolean;
  mountPoint?: string;
  right?: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);
const open = useVModel(props, "modelValue", emit);
const setOpen = (val: boolean) => {
  open.value = val;
};
</script>

<template>
  <div v-show="open" class="overlay" @click.self="setOpen(false)"></div>
  <div
    :class="{
      drawer: true,
      closed: !open,
      right: right,
      left: !right,
    }"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.overlay {
  @apply fixed w-full h-full top-0 left-0 z-10 lg:z-auto bg-gray-500 bg-opacity-10 lg:hidden;
}
.drawer {
  @apply h-full overflow-visible bg-surface-700 transform fixed lg:static ease-in-out transition duration-150 z-30 lg:z-auto;
  &.left {
    @apply top-0 left-0;
  }
  &.right {
    @apply right-0 top-0;
  }
}
.closed.left {
  @apply -translate-x-full lg:transform-none;
}
.closed.right {
  @apply translate-x-200 lg:transform-none;
}
</style>
