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
    v-bind="$props"
  >
    <slot />
  </button>
</template>

<style scoped lang="postcss">
.root {
  @apply px-4 py-2 outline-none rounded transition duration-200 ease-in-out justify-center items-center;
  &:disabled {
    @apply pointer-events-none;
  }
}

.not-flat {
  @apply shadow-lg;
  &:hover {
    transform: translate(0, -0.125rem);
    @apply shadow-xl;
  }
}

.primary {
  &.filled {
    @apply bg-primary-400 text-white;
    &:hover {
      @apply bg-primary-300;
    }
  }
  &.outlined {
    @apply border-primary-300 text-primary-300;
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

.secondary {
  &.filled {
    @apply bg-secondary-400 text-white;
    &:hover {
      @apply bg-secondary-300;
    }
  }
  &.outlined {
    @apply text-secondary-300;
  }
  &.text {
    @apply text-secondary-300;
    &:hover {
      @apply bg-secondary-300 bg-opacity-25;
    }
  }
}

.icon {
  @apply rounded-full px-2 py-2;
}

.filled {
  &:disabled {
    @apply bg-gray-600 text-gray-500 bg-opacity-75;
  }
}

.outlined {
  @apply border;
  &:hover {
    @apply bg-current bg-opacity-25 text-white;
  }
  &:disabled {
    @apply border border-gray-500 text-gray-500 bg-opacity-75;
  }
}

.text {
  @apply text-white;
  &:hover {
    @apply bg-current bg-opacity-25;
  }
  &:disabled {
    @apply text-gray-500 bg-opacity-75;
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
