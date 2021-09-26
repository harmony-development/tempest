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
  @apply dark:border-surface-800 bg-surface-900 border-light-700;
}

.normal {
  @apply dark:border-surface-700 bg-surface-800;
}
</style>
