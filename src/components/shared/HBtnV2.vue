<script lang="ts" setup>
import { defineProps } from "vue";

defineProps<{
  rounded?: boolean;
  outlined?: boolean;
  icon?: boolean;
  disabled?: boolean;
}>();
</script>

<template>
  <a
    v-wave
    class="btn"
    :class="{
      rounded,
      outlined,
      icon,
      'non-text': !icon,
      disabled,
    }"
  >
    <slot />
  </a>
</template>

<style lang="postcss" scoped>
.btn {
  @apply bg-white bg-opacity-0 transition duration-100 
  rounded-sm cursor-pointer flex justify-center 
  align-middle w-min select-none;
}

.disabled {
  @apply pointer-events-none opacity-50;
}

.btn:hover {
  @apply bg-opacity-10;
}

.icon {
  @apply p-2;
}

.non-text {
  @apply px-4 py-2;
}

.rounded {
  @apply rounded-full;
}

.outlined {
  @apply border-1 border-white border-opacity-10 bg-harmonydark-900;
}

.filled {
  @apply bg-primary-300;
}
</style>
