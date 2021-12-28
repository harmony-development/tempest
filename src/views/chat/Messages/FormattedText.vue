<script lang="ts" setup>
import type { FormattedText } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import { computed } from "vue";
import { linkify } from "~/logic/formatting";

const props = defineProps<{
	content: FormattedText
}>();

const content = computed(() => {
	const { content } = props;

	return linkify(content.text);
});
</script>

<template>
  <p v-html="content" />
</template>
