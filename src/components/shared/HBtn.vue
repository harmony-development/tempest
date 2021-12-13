<script setup lang="ts">
import { computed, defineProps, toRefs } from "vue";

const props = defineProps<{
  variant?: "text" | "filled" | "outlined";
  color?: "primary" | "secondary";
  icon?: boolean;
  raised?: boolean;
  dense?: boolean;
  square?: boolean;
}>();

const buttonClasses = computed(() => ({
  btn: true,
  [props.variant || "text"]: true,
  [props.color || "plain"]: true,
  icon: props.icon,
  raised: props.raised,
  dense: props.dense,
  square: props.square,
}));
</script>
<template>
  <a v-wave :class="buttonClasses">
    <slot />
  </a>
</template>

<style lang="postcss" scoped>
.btn {
  color: inherit;
  @apply px-4 py-2 rounded transition duration-100 ease-in-out 
    inline-flex justify-center items-center 
    cursor-pointer select-none;

  &.dense {
    @apply p-1;
  }

  &:disabled {
    @apply pointer-events-none;
  }

  &:focus-visible {
    @apply ring ring-2 ring-primary-300;
  }

  &:hover {
    @apply ring ring-current ring-2;
  }

  &:active {
    box-shadow: 0px 1px 4px #00000050;
  }
}

.square {
  aspect-ratio: 1;
  @apply p-2;
}

.icon {
  @apply rounded-full p-3 w-auto;
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

.outlined {
  @apply border-2;
}

.primary {
  &.filled {
    @apply bg-primary-600 text-white;
    &:hover {
      @apply bg-primary-500;
    }
  }
  &.outlined {
    @apply border-primary-400 text-primary-400;
  }
  &.text {
    @apply text-primary-400;
    &:hover {
      @apply bg-primary-300 bg-opacity-10;
    }
  }
}

.secondary {
  &.filled {
    @apply bg-secondary-600 text-white;
    &:hover {
      @apply bg-secondary-500;
    }
  }
  &.outlined {
    @apply border-secondary-400 text-secondary-400;
  }
  &.text {
    @apply text-secondary-400;
    &:hover {
      @apply bg-secondary-300 bg-opacity-10;
    }
  }
}

.plain {
  &.text {
    &:hover {
      @apply bg-white bg-opacity-10;
    }
  }

  &.outlined {
    @apply border-current border-1 text-current;
  }
}

@variants disabled {
  .btn.text {
    @apply text-gray-500;
  }

  .btn.filled {
    @apply bg-gray-400 bg-gray-600 text-gray-500 dark:text-gray-500 bg-opacity-75;
  }
}
</style>
