<template>
  <div>
    <label class="flex items-center gap-2 select-none">
      <input class="opacity-0 absolute h-8 w-8" type="checkbox">
      <div class="border-primary-500 border-2 text-transparent rounded-md w-8 h-8 flex flex-shrink-0 justify-center items-center">
        <mdi-check />
      </div>
      {{ name }}
    </label>
  </div>
</template>

<script setup lang="ts">
defineProps<{
	name: string
}>();
defineEmits([]);

</script>

<style scoped lang="postcss">
input:checked + div {
  @apply bg-primary-500 text-white border-3;
}
input:checked + div svg {
  @apply block;
}
</style>
