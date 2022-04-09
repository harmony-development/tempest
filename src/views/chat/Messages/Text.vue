<script lang="ts" setup>
import type { Content } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import type { MediaMetadata } from "@harmony-dev/harmony-web-sdk/dist/gen/mediaproxy/v1/mediaproxy";
import { computed, watch } from "vue";
import { getLinks } from "~/logic/formatting";
import { parseHMC } from "~/logic/parsing";
import { chatState } from "../../../logic/store/chat";
import { useChatRoute } from "../../../router";
import { useAPI } from "../../../services/api";
import Attachment from "./Attachment.vue";
import FormattedText from "./FormattedText.vue";
const props = defineProps<{
	content: Content;
}>();

const { host } = useChatRoute();

const api = useAPI();

const urls = computed(() => {
	if (!props.content?.text) return;
	return getLinks(props.content?.text);
});
const metadatas = computed(() => {
	if (!urls.value) return;
	return urls.value.map((url) => chatState.getURLMetadata(host.value!, url));
});

const metaToAttachment = (metadata: MediaMetadata) => ({
	...metadata,
	size: metadata.size || 0,
});

watch(
	urls,
	async () => {
		if (!urls.value) return;
		await api.fetchMetadata(host.value!, urls.value);
	},
	{ immediate: true }
);
</script>

<template>
	<div class="content-out">
		<formatted-text :text="content.text" :formats="content.textFormats" />
		<div v-for="(metadata, i) of metadatas" :key="urls?.[i]" class="p-3 flexcol gap-2 mt-2 bg-surface-900">
			<template v-if="metadata?.oneofKind === 'isSite'">
				<a class="font-bold" :href="metadata.isSite.url" target="_blank">
					{{ metadata.isSite.pageTitle }}
				</a>
				<span class="text-gray-500">
					{{ metadata.isSite.description }}
				</span>
				<template v-for="thumbnail of metadata.isSite.thumbnail" :key="thumbnail.url">
					<img :src="parseHMC(thumbnail.url, host!)" :width="thumbnail.width" :height="thumbnail.height" />
				</template>
			</template>
			<template v-else-if="metadata?.oneofKind === 'isMedia'">
				<attachment :id="urls![i]" :host="host!" :attachment="metaToAttachment(metadata.isMedia)" />
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
