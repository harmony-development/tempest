<script lang="ts" setup>
import type { FormattedText } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import { computed } from "vue";
import type { Format } from "../../../../../harmony-web-sdk/gen/chat/v1/messages";
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
