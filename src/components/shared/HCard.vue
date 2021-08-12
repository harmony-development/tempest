<script lang="ts" setup>
import { defineProps } from "vue";

defineProps<{
  dark?: boolean;
}>();
</script>

<template>
  <div class="p-3 border-2" :class="{ dark, light: !dark }">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.dark {
  @apply border-harmonydark-800 bg-harmonydark-900;
}

.light {
  @apply border-harmonydark-700 bg-harmonydark-800;
}
</style>
