<template>
  <button
    v-wave
    :class="{
      root: true,
      outlined,
      text,
      filled,
      icon,
      'not-flat': !flat,
      primary: color === 'primary',
      secondary: color === 'secondary',
    }"
  >
    <slot />
  </button>
</template>

<style scoped lang="postcss">
.root {
  @apply px-4 py-2 outline-none rounded transition duration-200 ease-in-out;
}

.not-flat {
  @apply shadow-lg;
  &:hover {
    transform: translate(0, -0.125rem);
    @apply shadow-xl;
  }
}

.icon {
  @apply rounded-full px-2 py-2 w-10 h-10;
}

.text {
  @apply bg-transparent;
}

.primary {
  &.filled {
    @apply bg-primary-400 text-white;
    &:hover {
      @apply bg-primary-300;
    }
  }
  &.outlined {
    @apply border-2 border-primary-300 text-primary-300;
    &:hover {
      @apply bg-primary-300 text-white bg-opacity-25;
    }
  }
  &.text {
    @apply text-primary-300;
    &:hover {
      @apply bg-primary-300 bg-opacity-25;
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    filled: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Boolean,
      default: false,
    },
    flat: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String as () => 'primary' | 'secondary',
      default: 'primary',
    },
  },
})
</script>
