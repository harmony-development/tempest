<script lang="ts" setup>
defineProps<{
  src: string;
  active?: boolean;
  name: string;
}>();
</script>

<template>
  <div v-wave class="icon" :class="{ active }" style="aspect-ratio: 1">
    <HImg
      :src="src"
      class="object-contain pointer-events-none"
      draggable="false"
      fallback="H"
    />
    {{ name }}
  </div>
</template>

<style lang="postcss" scoped>
.icon {
  @apply w-full
      bg-surface-500
      rounded-full
      cursor-pointer
      overflow-hidden
      flex-shrink-0
      select-none
      border-primary-300
      transition transition-all
      duration-100
      border-0;
  &:active {
    @apply border-4 bg-surface-600;
  }
}

.active {
  @apply border-2;
}
</style>
