<script lang="ts" setup>
import { Content_EmbedContent } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import { computed } from "vue";

const props = defineProps<{
  content: Content_EmbedContent;
}>();

function toColor(num: number) {
  return "#" + num.toString(16).padStart(6, "0");
}

const embed = computed(() => props.content.embed!);
const color = computed(() => toColor(embed.value.color!));
</script>

<template>
  <div class="border-l-2 p-3 bg-surface-800" :style="{ borderColor: color }">
    <h1 class="font-bold">{{ embed.title }}</h1>
    <p class="mt-2 text-xs text-gray-300">
      {{ embed.body }}
    </p>
  </div>
</template>
