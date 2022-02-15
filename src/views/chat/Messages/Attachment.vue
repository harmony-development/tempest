<template>
  <img v-if="imageInfo" :style="{background: `url(${thumbnail}) no-repeat`}" :src="parseHMC(id, host)" :width="imageInfo.width" :height="imageInfo.height" border="0">
  <audio v-else-if="mimetype.startsWith('audio/')" controls :src="parseHMC(id, host)" />
  <a v-else :href="parseHMC(id, host)" target="_blank">{{ name }}</a>
</template>

<script setup lang="ts">
import type { Attachment } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import { computed, toRefs } from "vue";
import { parseHMC } from "~/logic/parsing";

const props = defineProps<{
	host: string
	attachment: Attachment
}>();

const { id, mimetype, info, name, size } = toRefs(props.attachment);
const imageInfo = computed(() => info.value.oneofKind === "photo" ? info.value.photo : undefined);
const thumbnail = computed(() => {
	if (!imageInfo.value?.minithumbnail) return;
	return URL.createObjectURL(new Blob([imageInfo.value.minithumbnail.data], { type: "image/jpeg" }));
});
</script>
