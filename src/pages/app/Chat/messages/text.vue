<script lang="ts" setup>
import { UpdateMessageTextRequest } from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/chat/v1/messages";
import {
  Attachment,
  ContentText,
} from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/harmonytypes/v1/types";
import { useVModel } from "@vueuse/core";
import DOMPurify from "dompurify";
import { computed, defineProps, reactive, ref, watch } from "vue";
import AttachmentVue from "./Attachment.vue";
import { getOrFederate } from "~/logic/connections";
import { useAppRoute } from "~/logic/location";
import { conv } from "~/logic/markdown";
import { parseLinks } from "~/logic/utils/parsing";

const props = defineProps<{
  content: ContentText;
  messageid: string;
  editing: boolean;
}>();
const emit = defineEmits(["update:editing"]);
const editing = useVModel(props, "editing", emit);

const route = useAppRoute();

const editText = ref("");
const previewLinks = reactive<{
  [key: string]: Attachment;
}>({});

const editMessage = async (content: string) => {
  const conn = await getOrFederate(route.value.host);
  await conn.chat.updateMessageText(
    UpdateMessageTextRequest.create({
      guildId: route.value.guildid,
      channelId: route.value.channelid,
      messageId: props.messageid,
      newContent: content,
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
  return DOMPurify.sanitize(conv.makeHtml(props.content.content));
});

const links = computed(() => {
  return parseLinks(props.content.content);
});

watch(
  links,
  async () => {
    const conn = await getOrFederate(route.value.host);
    links.value.forEach(async (url) => {
      if (previewLinks[url]) return;
      const { response } = await conn.mediaProxy.fetchLinkMetadata({
        url,
      });

      if (response.data.oneofKind === "isMedia") {
        const media = response.data.isMedia;
        previewLinks[url] = {
          id: url,
          name: response.data.oneofKind,
          type: media.mimetype,
          size: 0,
          caption: "",
        };
      } else if (response.data.oneofKind === "isSite") {
        const site = response.data.isSite;
        previewLinks[url] = {
          id: site.image,
          name: response.data.isSite.siteTitle,
          type: site.kind,
          size: 0,
          caption: "",
        };
      }
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
    :model-value="props.content.content || editing"
    multiline
    class="w-full"
    @update:model-value="editText = $event"
    @keydown="onEditKeyDown"
  />
  <p v-else class="content-out whitespace-pre-wrap" v-html="sanitized" />
  <AttachmentVue
    v-for="value in previewLinks"
    :key="value.id"
    :attachment="value"
  />
</template>

<style lang="postcss" scoped>
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
