<script setup lang="ts">
import { defineProps } from 'vue'

const { absolute } = defineProps({
  absolute: Boolean,
})

const classes = {
  appbar: true,
  absolute,
}
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<style lang="postcss">
  .appbar {
    @apply w-full bg-gray-100 dark:bg-harmonydark-600 mx-auto p-3 flex items-center h-14;
  }

  /* TODO: REMOVE THIS WHEN https://github.com/windicss/vue-windicss-preprocess/issues/14 IS RESOLVED */
  .absolute {
    @apply absolute;
  }
</style>
