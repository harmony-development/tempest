<script lang="ts" setup>
import { AuthStep_Choice } from "@harmony-dev/harmony-web-sdk/dist/gen/auth/v1/auth";
import HListItem from "~/components/shared/HListItem.vue";

defineProps<{
  choice: AuthStep_Choice;
}>();

defineEmits<{
  (event: "done", choice: string): void;
}>();
</script>

<template>
  <h1 class="font-bold">{{ choice.title }}</h1>
  <ol class="bg-surface-800 mt-3">
    <h-list-item v-for="opt in choice.options" @click="$emit('done', opt)">
      {{ opt }}
    </h-list-item>
  </ol>
</template>
