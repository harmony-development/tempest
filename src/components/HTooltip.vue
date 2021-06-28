<script setup lang="ts">
import { defineProps } from "@vue/runtime-core";
import { useFloatingPos } from "~/composeables/useFloatingPos";

const props = defineProps<{
  activator: HTMLElement;
}>();

const { x, y, menu, activator } = useFloatingPos(open);
</script>

<template>
  <Teleport to="#app">
    <div class="bg-gray-500 bg-opacity-10 p-3">
      <slot />
    </div>
  </Teleport>
</template>
