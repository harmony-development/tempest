<script lang="ts" setup>
import type { Format } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import { computed } from "vue";
import { linkify } from "~/logic/formatting";

const props = defineProps<{
	text: string
	formats: Format[]
}>();

const content = computed(() => {
	return linkify(props.text);
});
</script>

<template>
  <p v-html="content" />
</template>
