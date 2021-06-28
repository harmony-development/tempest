<script setup lang="ts">
import { onClickOutside, useVModel } from "@vueuse/core";
import { computed, nextTick, defineProps, defineEmit } from "vue";
import { updateMenuPos, useFloatingPos } from "~/composeables/useFloatingPos";

const props = defineProps<{
  modelValue: boolean;
}>();
const emit = defineEmit(["update:modelValue"]);

const open = useVModel(props, "modelValue", emit);

const { x, y, menu, activator } = useFloatingPos(open);

onClickOutside(menu, () => {
  open.value = false;
});

async function toggle(ev: MouseEvent) {
  open.value = true;
  await nextTick();
  const el = ev.currentTarget as Element;
  activator.value = el;
  updateMenuPos(activator, menu, x, y);
}

const menuStyle = computed(() => {
  return {
    top: `${y.value}px`,
    left: `${x.value}px`,
  };
});
</script>

<template>
  <slot name="activator" :toggle="toggle" />
  <Teleport to="#app">
    <transition name="menu">
      <div
        v-show="open"
        ref="menu"
        class="z-50 fixed"
        :style="menuStyle"
        v-bind="$attrs"
      >
        <slot />
      </div>
    </transition>
  </Teleport>
</template>

<style lang="postcss" scoped>
.menu-enter-active,
.menu-leave-active {
  @apply transform;
  transition: opacity 0.05s linear, transform 0.05s linear;
}

.menu-enter-from,
.menu-leave-to {
  @apply opacity-0 -translate-y-2;
}
</style>
