<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { onKeyStroke, useVModel } from "@vueuse/core";
import PopInTransition from "~/components/transitions/PopInTransition.vue";
const props = defineProps<{
  modelValue?: boolean;
  unsized?: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);
const open = useVModel(props, "modelValue", emit);
onKeyStroke("Escape", () => (open.value = false));
</script>

<template>
  <Teleport to="#app">
    <pop-in-transition>
      <div
        v-if="open"
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
          class="shadow-xl p-4 bg-surface-900"
          :class="{ sized: !unsized }"
          v-bind="$attrs"
          @mousedown.stop=""
        >
          <slot />
        </div>
      </div>
    </pop-in-transition>
  </Teleport>
</template>

<style lang="postcss" scoped>
.sized {
  @apply w-7/8 sm:w-4/5 lg:w-120;
}
</style>
