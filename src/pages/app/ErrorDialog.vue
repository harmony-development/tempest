<script lang="ts" setup>
import { computed, defineProps } from "@vue/runtime-core";

const props = defineProps<{
  err?: Error;
}>();

const errorText = computed(() => {
  return props.err?.name;
});
</script>

<template>
  <div>
    <h1 v-t="'app.error-occured.title'" class="text-lg" />
    <p class="text-gray-400">{{ errorText }}</p>
  </div>
</template>
