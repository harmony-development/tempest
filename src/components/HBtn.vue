<script setup lang="ts">
import { defineProps } from 'vue'

const { variant, color, icon, raised } = defineProps<{
  variant: 'text' | 'filled' | 'outlined'
  color?: 'primary' | 'secondary'
  icon?: boolean
  raised?: boolean
}>()

const buttonClasses = {
  btn: true,
  [variant]: true,
  [color || 'plain']: true,
  icon,
  raised,
}
</script>
<template>
  <button v-wave :class="buttonClasses">
    <slot />
  </button>
</template>

<style lang="postcss">
.btn {
  @apply px-4 py-2 rounded focus:outline-none transition duration-200 ease-in-out flex justify-center items-center;
  &:disabled {
    @apply pointer-events-none;
  }
}

.icon {
  @apply rounded-full px-3 py-3;
}

.raised {
  @apply shadow-sm;

  &:hover {
    transform: translate(0, -0.125rem);
    @apply shadow-md;
  }

  &:active {
    transform: translate(0);
    @apply shadow-lg;
  }
}

.primary.filled {
  @apply bg-primary-400 text-white;
  &:hover {
    @apply bg-primary-300;
  }
}

.primary.outlined {
  @apply border-primary-300 border-1 text-primary-300;
}
</style>
