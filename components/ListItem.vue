<template>
  <div
    v-wave
    :class="{
      'list-item': true,
      selected,
    }"
  >
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.list-item {
  @apply flex items-center rounded w-full py-2 px-4 cursor-pointer select-none transition duration-200;

  &:hover {
    @apply bg-white bg-opacity-10;
  }
}

.selected {
  @apply bg-white bg-opacity-20;
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
