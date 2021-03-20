<script lang="ts" setup>
import { useVModel } from "@vueuse/core";
import { defineComponent, defineEmit, defineProps } from "vue";

defineComponent({
  inheritAttrs: false,
});
const props = defineProps<{
  modelValue: boolean;
  mountPoint?: string;
  right?: boolean;
}>();
const emit = defineEmit(["update:modelValue"]);

const open = useVModel(props, "modelValue", emit);

const setOpen = (val: boolean) => {
  open.value = val;
};
</script>

<template>
  <div v-show="open" class="overlay" @click.self="setOpen(false)"></div>
  <Teleport :to="props.mountPoint || '#drawer-root'">
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
  </Teleport>
</template>

<style lang="postcss" scoped>
.overlay {
  @apply fixed w-full h-full top-0 left-0 z-10 md:z-auto overflow-auto bg-gray-500 bg-opacity-10 md:hidden;
}

.drawer {
  @apply h-full bg-harmonydark-700 transform fixed md:static overflow-auto ease-in-out transition duration-150 z-30 md:z-auto;

  &.left {
    @apply top-0 left-0;
  }

  &.right {
    @apply right-0 top-0;
  }
}

.closed.left {
  @apply -translate-x-full md:transform-none;
}

.closed.right {
  @apply translate-x-200 md:transform-none;
}
</style>
