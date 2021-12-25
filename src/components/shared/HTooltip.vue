<script lang="ts" setup>
import HPopover from "./HPopover.vue";

defineProps<{
  content?: string;
}>();
</script>

<template>
  <h-popover placement="right" open-on-hover>
    <slot />
    <template #content>
      <div class="bg-primary-500 p-1 px-2">
        <p>{{ content }}</p>
      </div>
    </template>
  </h-popover>
</template>
