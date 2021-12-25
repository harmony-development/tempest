<script lang="ts" setup>
import { FormattedText } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";

defineProps<{
	content: FormattedText;
}>();
</script>

<template>
	<p>{{ content.text }}</p>
</template>
