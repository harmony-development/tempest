<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps<{
  selected?: boolean;
  dangerous?: boolean;
}>();
</script>

<template>
  <li
    ref="item"
    role="button"
    v-wave
    :class="{
      'list-item': true,
      selected: props.selected,
      dangerous,
    }"
    tabindex="0"
  >
    <slot />
  </li>
</template>

<style lang="postcss" scoped>
.list-item {
  @apply w-full py-2 px-3 cursor-pointer select-none transition duration-100 whitespace-nowrap
         flex align-middle items-center;
  &:hover {
    @apply bg-white bg-opacity-10 bg-opacity-10;
  }
  &:focus-visible {
    @apply ring-3 ring-primary-300 ring-inset;
  }
}
.selected {
  @apply bg-white bg-opacity-5 bg-opacity-5;
}

.dangerous {
  @apply text-red-500;
}
</style>
