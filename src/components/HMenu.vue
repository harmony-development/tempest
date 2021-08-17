<script setup lang="ts">
import {
  debouncedWatch,
  onClickOutside,
  useVModel,
  useWindowSize,
} from "@vueuse/core";
import { computed, nextTick, defineProps, defineEmits, ref } from "vue";

const props = defineProps<{
  modelValue: boolean;
  full?: boolean;
  closeOnClick?: boolean;
  direction?: "left" | "right" | "bottom" | "top";
}>();
const emit = defineEmits(["update:modelValue"]);

const open = useVModel(props, "modelValue", emit);

const { width, height } = useWindowSize();

const x = ref(0);
const y = ref(0);
const menu = ref<HTMLDivElement | null>(null);
const activator = ref<Element | null>(null);

const updateMenuPos = () => {
  const activatorBbox = activator.value!.getBoundingClientRect();
  const menuBbox = menu.value!.getBoundingClientRect();

  if (props.direction === "left") {
    x.value = -menuBbox.width;
  } else {
    let targetY = activatorBbox.height;
    if (targetY + activatorBbox.y + menuBbox.height > window.innerHeight) {
      targetY = -menuBbox.height;
    }
    y.value = targetY;
  }
};

onClickOutside(menu, () => {
  open.value = false;
});

async function toggle(ev: MouseEvent) {
  open.value = true;
  await nextTick();
  const el = ev.currentTarget as Element;
  activator.value = el;
  updateMenuPos();
}

debouncedWatch(
  [width, height],
  () => {
    if (open.value && activator) updateMenuPos();
  },
  {
    debounce: 150,
  }
);

const menuStyle = computed(() => {
  return {
    top: `${y.value}px`,
    left: `${x.value}px`,
  };
});
</script>

<template>
  <div class="relative">
    <div>
      <slot name="activator" :toggle="toggle" />
    </div>
    <transition name="menu">
      <div
        v-show="open"
        ref="menu"
        :class="{ menu: true, fullwidth: props.full }"
        :style="menuStyle"
        v-bind="$attrs"
      >
        <slot />
      </div>
    </transition>
  </div>
</template>

<style lang="postcss" scoped>
.menu {
  @apply z-100 absolute overflow-hidden;
}

.fullwidth {
  @apply w-full;
}

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
