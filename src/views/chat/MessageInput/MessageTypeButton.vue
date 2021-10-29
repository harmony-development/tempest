<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script lang="ts" setup>

defineProps<{
  label: string;
}>()
</script>

<template>
  <div
    class="text-center flex-col flex items-center gap-2 hover:bg-white hover:bg-opacity-5 active:bg-opacity-10 p-2 rounded cursor-pointer select-none transition duration-75"
  >
    <button class="w-12 h-12 rounded-full flex justify-center items-center" v-bind="$attrs">
      <slot />
    </button>
    <p class="text-center text-xs text-gray-300 uppercase">{{ label }}</p>
  </div>
</template>