<script lang="ts" setup>
import BasePopover from "./BasePopover.vue";

defineProps<{
	content?: string
}>();
</script>

<template>
  <base-popover placement="right" open-on-hover>
    <slot />
    <template #content>
      <div class="bg-primary-500 p-1 px-2">
        <p>{{ content }}</p>
      </div>
    </template>
  </base-popover>
</template>
