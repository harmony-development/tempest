<script lang="ts" setup>
import type { AuthStep_Choice } from "@harmony-dev/harmony-web-sdk/dist/gen/auth/v1/auth";

defineProps<{
	choice: AuthStep_Choice
	error: unknown
}>();

defineEmits<{
	(event: "done", choice: string): void
}>();
</script>

<template>
  <h1 class="font-bold">
    {{ choice.title }}
  </h1>
  <span class="text-error">{{ error }}</span>
  <ol class="bg-surface-800 mt-3">
    <base-list-item v-for="opt in choice.options" :key="opt" @click="$emit('done', opt)">
      {{ opt }}
    </base-list-item>
  </ol>
</template>
