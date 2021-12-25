<script lang="ts" setup>
import type { Content_TextContent } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import FormattedText from "./FormattedText.vue";
defineProps<{
	content: Content_TextContent["content"]
}>();
</script>

<template>
  <p class="content-out whitespace-pre-wrap">
    <formatted-text :content="content!" />
  </p>
</template>
<style lang="postcss" scoped>
p {
	@apply inline-block;
}
.content-out::v-deep(.codeblock) {
	@apply w-full block break-all break-words whitespace-pre-wrap pr-3 rounded-sm bg-black;
}
.content-out ::v-deep(.codeblock > code) {
	@apply break-all w-full block p-3 pl-4 break-words whitespace-pre-wrap;
}
.content-out ::v-deep(.msg-p) {
	margin-bottom: 0px;
	width: auto;
}
.content-out ::v-deep(.emoji) {
	height: 1em;
	vertical-align: middle;
}
.content-out ::v-deep(.big-emoji) {
	height: 3em;
}
.content-out ::v-deep(a) {
	@apply text-primary-300 underline;
}
</style>
