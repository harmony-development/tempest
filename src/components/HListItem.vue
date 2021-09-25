<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  selected?: boolean;
}>();
</script>

<template>
  <li
    ref="item"
    v-wave
    :class="{
      'list-item': true,
      selected: props.selected,
    }"
    tabindex="0"
  >
    <slot />
  </li>
</template>

<style lang="postcss" scoped>
.list-item {
  @apply flex items-center w-full py-2 px-4 cursor-pointer select-none transition duration-100;

  &:hover {
    @apply bg-black bg-white bg-opacity-10 bg-opacity-10;
  }

  &:focus-visible {
    @apply ring ring-2 ring-primary-300;
  }
}

.selected {
  @apply bg-black bg-white bg-opacity-5 bg-opacity-5;
}
</style>
