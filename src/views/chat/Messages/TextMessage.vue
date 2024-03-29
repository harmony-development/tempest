<script lang="ts" setup>
import type { Content_TextContent } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import { computed, watch } from "vue";
import { useAPI } from "../../../services/api";
import { chatState } from "../../../logic/store/chat";
import { useChatRoute } from "../../../router";
import FormattedText from "./FormattedText.vue";
import Attachment from "./Attachment.vue";
import { getLinks } from "~/logic/formatting";
import BaseImage from "~/components/base/BaseImage.vue";
import { parseHMC } from "~/logic/parsing";
const props = defineProps<{
	content: Content_TextContent["content"]
}>();

const { host } = useChatRoute();

const api = useAPI();

const urls = computed(() => {
	if (!props.content?.text) return;
	return getLinks(props.content?.text);
});
const metadatas = computed(() => {
	if (!urls.value) return;
	return urls.value.map(url => chatState.getURLMetadata(host.value!, url));
});

watch(urls, async() => {
	if (!urls.value) return;
	for (const url of urls.value)
		await api.fetchMetadata(host.value!, url);
}, { immediate: true });
</script>

<template>
  <div class="content-out">
    <formatted-text :content="content!" />
    <div v-for="(metadata, i) of metadatas" :key="urls?.[i]" class="p-3 flexcol gap-2 mt-2 bg-surface-900">
      <template v-if="metadata?.oneofKind === 'isSite'">
        <a class="font-bold" :href="metadata.isSite.url" target="_blank">
          {{ metadata.isSite.pageTitle }}
        </a>
        <span class="text-gray-500">
          {{ metadata.isSite.description }}
        </span>
        <img v-if="metadata.isSite.image" :src="parseHMC(metadata.isSite.image, host!)">
      </template>
      <template v-else-if="metadata?.oneofKind === 'isMedia'">
        <attachment :id="urls![i]" :host="host!" :mimetype="metadata.isMedia.mimetype" :name="metadata.isMedia.filename" />
      </template>
    </div>
  </div>
</template>
<style lang="postcss" scoped>
p {
	@apply inline-block;
}
.content-out::v-deep(.codeblock) {
	@apply w-full block pr-3 rounded-sm bg-black;
}
.content-out ::v-deep(.codeblock > code) {
	@apply break-all w-full block p-3 pl-4;
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
