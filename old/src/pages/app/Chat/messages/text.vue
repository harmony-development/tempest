<script lang="ts" setup>
import {
  UpdateMessageTextRequest,
  Content_TextContent,
} from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import { useVModel } from "@vueuse/core";
import DOMPurify from "dompurify";
import { computed, defineProps, ref, watch } from "vue";
import MediaEmbed from "./Embeds/MediaEmbed.vue";
import SiteEmbed from "./Embeds/SiteEmbed.vue";
import { getOrFederate } from "~/logic/connections";
import { useAppRoute } from "~/logic/location";
import { conv } from "~/logic/markdown";
import { parseLinks } from "~/logic/utils/parsing";
import { appState } from "~/store/app";

const props = defineProps<{
  content: Content_TextContent["content"];
  messageid: string;
  editing: boolean;
}>();
const emit = defineEmits(["update:editing"]);
const editing = useVModel(props, "editing", emit);

const route = useAppRoute();

const editText = ref("");

const editMessage = async (content: string) => {
  const conn = await getOrFederate(route.value.host);
  await conn.chat.updateMessageText(
    UpdateMessageTextRequest.create({
      guildId: route.value.guildid,
      channelId: route.value.channelid,
      messageId: props.messageid,
      newContent: {
        text: content,
      },
    })
  );
};

const onEditKeyDown = async (ev: KeyboardEvent) => {
  if (ev.key === "Enter" && !ev.shiftKey) {
    ev.preventDefault();
    editMessage(editText.value);
    editing.value = false;
  }
  if (ev.key === "Escape") {
    ev.preventDefault();
    editing.value = false;
  }
};

const sanitized = computed(() => {
  return DOMPurify.sanitize(conv.makeHtml(props.content!.text));
});

const links = computed(() => {
  return parseLinks(props.content!.text);
});

const previewLinks = computed(() =>
  links.value
    .map((url) => ({
      url,
      preview: appState.getPreview(url),
    }))
    .filter((preview) => !!preview.preview)
);

watch(
  links,
  async () => {
    const conn = await getOrFederate(route.value.host);
    links.value.forEach(async (url) => {
      if (appState.getPreview(url)) return;
      const { response } = await conn.mediaProxy.fetchLinkMetadata({
        url,
      });
      appState.setPreview(url, response.data);
    });
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <h-input
    v-if="editing"
    :model-value="props.content?.text"
    multiline
    class="w-full"
    @update:model-value="editText = $event"
    @keydown="onEditKeyDown"
  />
  <p v-else class="content-out whitespace-pre-wrap" v-html="sanitized" />
  <template v-for="value in previewLinks" :key="value.src">
    <MediaEmbed
      v-if="value.preview.oneofKind === 'isMedia'"
      :media-embed="value.preview.isMedia"
      :src="value.url"
    />
    <SiteEmbed
      v-if="value.preview.oneofKind === 'isSite'"
      :site-embed="value.preview.isSite"
    />
  </template>
</template>

<style lang="postcss" scoped>
p {
  @apply inline-block;
}
.content-out:deep(.codeblock) {
  @apply w-full block break-all break-words whitespace-pre-wrap pr-3 rounded-md bg-black;
}
.content-out >>> .codeblock > code {
  @apply break-all w-full block p-3 pl-4 break-all break-words whitespace-pre-wrap;
}
.content-out >>> .msg-p {
  margin-bottom: 0px;
  width: auto;
}
.content-out >>> .emoji {
  height: 1em;
  vertical-align: middle;
}
.content-out >>> .big-emoji {
  height: 3em;
}

.content-out >>> a {
  @apply text-primary-300 underline;
}
</style>
