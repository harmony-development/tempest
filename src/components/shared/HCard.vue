<script lang="ts" setup>
import { defineProps } from "vue";

defineProps<{
  darkened?: boolean;
}>();
</script>

<template>
  <div class="p-3 border-2" :class="{ darkened, normal: !darkened }">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.darkened {
  @apply dark:border-harmonydark-800 dark:bg-harmonydark-900 border-light-700 bg-light-400;
}

.normal {
  @apply dark:border-harmonydark-700 dark:bg-harmonydark-800;
}
</style>
