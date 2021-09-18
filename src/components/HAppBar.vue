<script setup lang="ts">
import { defineProps } from "vue";

const { absolute } = defineProps({
  absolute: Boolean,
});
</script>

<template>
  <div class="appbar" :class="{ absolute }">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.appbar {
  @apply w-full bg-gray-100 dark:bg-harmonydark-600 mx-auto p-3 flex items-center h-14;
}
</style>
