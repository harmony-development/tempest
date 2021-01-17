<template>
  <button
    v-wave
    :class="{
      root: true,
      outlined,
      filled: !outlined,
      primary: color === 'primary',
      secondary: color === 'secondary',
    }"
  >
    <slot />
  </button>
</template>

<style scoped lang="postcss">
.root {
  @apply px-6 py-2 outline-none rounded shadow-lg transition duration-200 ease-in-out;
  &:hover {
    @apply shadow-xl transform;
  }
}

.primary {
  &.filled {
    @apply bg-primary-500 text-white;
    &:hover {
      @apply bg-primary-400;
    }
  }
  &.outlined {
    @apply border-2 border-primary-500 text-primary-500;
    &:hover {
      @apply bg-primary-500 text-white;
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    color: {
      type: String as () => 'primary' | 'secondary',
      default: 'primary',
    },
    outlined: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
