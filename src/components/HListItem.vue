<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  selected?: boolean;
}>();
</script>

<template>
  <li
    v-wave
    :class="{
      'list-item': true,
      selected: props.selected,
    }"
  >
    <slot />
  </li>
</template>

<style lang="postcss" scoped>
.list-item {
  @apply flex items-center w-full py-2 px-4 cursor-pointer select-none transition duration-200;

  &:hover {
    @apply bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10;
  }
}

.selected {
  @apply bg-black dark:bg-white bg-opacity-5 dark:bg-opacity-5;
}
</style>
