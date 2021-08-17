<script lang="ts" setup>
import { defineProps } from "vue";

defineProps<{
  rounded?: boolean;
  outlined?: boolean;
  icon?: boolean;
  disabled?: boolean;
  filled?: boolean;
  loading?: boolean;
}>();
</script>

<template>
  <a
    v-wave
    class="btn"
    :class="{
      rounded,
      outlined,
      icon,
      text: !icon,
      disabled,
      filled,
    }"
  >
    <div
      v-if="loading"
      class="absolute w-full h-full flex justify-center items-center"
    >
      <h-spinner />
    </div>
    <div class="flex" :class="{ disabled: loading }">
      <slot />
    </div>
  </a>
</template>

<style lang="postcss" scoped>
.btn {
  @apply bg-white bg-opacity-0 transition duration-100 
  rounded-sm cursor-pointer flex justify-center 
  items-center w-min select-none whitespace-nowrap relative;
}

.disabled {
  @apply pointer-events-none opacity-50;
}

.btn:hover {
  @apply bg-opacity-10;
}

.icon {
  @apply p-2;
}

.text {
  @apply px-4 py-2;
}

.rounded {
  @apply rounded-full;
}

.outlined {
  @apply border-1 border-white border-opacity-10 bg-harmonydark-900;
}

.filled {
  @apply bg-primary-500 hover:bg-primary-400;
}
</style>
