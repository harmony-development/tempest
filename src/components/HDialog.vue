<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { useVModel } from "@vueuse/core";

const props = defineProps<{
  modelValue: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);
const open = useVModel(props, "modelValue", emit);
</script>

<template>
  <Teleport to="#app">
    <transition name="dialog">
      <div
        v-show="open"
        class="
          bg-white
          flex
          h-full
          bg-opacity-5
          w-full
          top-0
          left-0
          z-50
          items-center
          align-center
          justify-center
          fixed
        "
        @mousedown="open = false"
      >
        <div
          class="
            bg-white
            shadow-xl
            p-4
            dark:bg-harmonydark-900
            w-7/8
            sm:w-4/5
            lg:w-120
          "
          v-bind="$attrs"
          @mousedown.stop=""
        >
          <slot />
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style lang="postcss" scoped>
.dialog-enter-active,
.dialog-leave-active {
  @apply transform;
  transition: opacity 0.05s linear, transform 0.05s linear;
}

.dialog-enter-from,
.dialog-leave-to {
  @apply opacity-0 -translate-y-2;
}
</style>
