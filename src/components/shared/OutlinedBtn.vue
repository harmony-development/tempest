<script lang="ts" setup>
import { defineProps } from "vue";

defineProps<{
  primary?: boolean;
}>();
</script>

<template>
  <a
    v-wave
    class="
      flex
      items-center
      justify-center
      cursor-pointer
      rounded-full
      transition-colors
      duration-200
    "
    :class="{ primary }"
  >
    <slot />
  </a>
</template>

<style lang="postcss" scoped>
.primary {
  @apply border-primary-400 text-primary-400 border-2 hover:bg-primary-400 hover:text-white;
}
</style>
