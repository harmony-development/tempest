<script setup lang="ts">
import { defineProps } from "vue";

const { variant, color, icon, raised, dense } = defineProps<{
  variant: "text" | "filled" | "outlined";
  color?: "primary" | "secondary";
  icon?: boolean;
  raised?: boolean;
  dense?: boolean;
}>();

const buttonClasses = {
  btn: true,
  [variant]: true,
  [color || "plain"]: true,
  icon,
  raised,
  dense,
};
</script>
<template>
  <button v-wave :class="buttonClasses">
    <slot />
  </button>
</template>

<style lang="postcss" scoped>
.btn {
  @apply px-4 py-2 rounded focus:outline-none transition duration-200 ease-in-out flex justify-center items-center;
  &:disabled {
    @apply pointer-events-none;
  }
}

.icon {
  @apply rounded-full p-3;

  &.dense {
    @apply p-1;
  }
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

.primary {
  &.filled {
    @apply bg-primary-300 text-white;
    &:hover {
      @apply bg-primary-200;
    }
  }
  &.outlined {
    @apply border-primary-300 border-1 text-primary-300;
  }
  &.text {
    @apply text-primary-300;
    &:hover {
      @apply bg-primary-400 bg-opacity-10;
    }
  }
}

.secondary {
  &.text {
    @apply text-secondary-300;
    &:hover {
      @apply bg-secondary-400 bg-opacity-10;
    }
  }
}

@variants disabled {
  .btn.text {
    @apply text-gray-500;
  }

  .btn.filled {
    @apply bg-gray-400 dark:bg-gray-600 text-gray-500 dark:text-gray-500 bg-opacity-75;
  }
}
</style>
