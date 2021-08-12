<script lang="ts" setup>
import { SendMessageRequest } from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/chat/v1/messages";
import { onStartTyping } from "@vueuse/core";

import { ref } from "vue";
import { UploadedFile } from "@harmony-dev/harmony-web-sdk";
import AttachmentBtn from "./AttachmentBtn.vue";
import type { IAttachment } from "./types";
import AttachmentsList from "./AttachmentsList.vue";
import HInput from "~/components/HInput.vue";
import { getOrFederate } from "~/logics/connections";
import { useAppRoute } from "~/logics/location";

const content = ref("");
const focus = ref(false);
const attachments = ref<IAttachment[]>([]);
const route = useAppRoute();

const sendMessage = async () => {
  const localID = Math.floor(Math.random() * 1000);
  const conn = await getOrFederate(route.value.host);
  let uploadAttachments = undefined as UploadedFile[] | undefined;
  let uploadPromises = [] as Promise<void>[];
  if (attachments.value.length > 0) {
    uploadAttachments = [];
    uploadPromises = attachments.value.map(async (f) => {
      const resp = await conn.uploadFile(f.file);
      if (f.preview) URL.revokeObjectURL(f.preview);
      uploadAttachments?.push(resp);
    });
  }
  await Promise.all(uploadPromises);
  if (uploadAttachments && uploadAttachments.length > 0) {
    const mapped = uploadAttachments.map((it) => ({
      name: it.name,
      type: it.contentType,
      id: it.id,
      size: it.size,
      caption: "",
    }));
    mapped[mapped?.length - 1].caption = content.value;

    await conn.chat.sendMessage(
      SendMessageRequest.create({
        guildId: route.value.guildid as string,
        channelId: route.value.channelid as string,
        content: {
          content: {
            oneofKind: "filesMessage",
            filesMessage: {
              attachments: mapped,
            },
          },
        },
        echoId: localID.toString(),
      })
    );
  } else {
    await conn.chat.sendMessage(
      SendMessageRequest.create({
        guildId: route.value.guildid as string,
        channelId: route.value.channelid as string,
        content: {
          content: {
            oneofKind: "textMessage",
            textMessage: {
              content: content.value,
            },
          },
        },
        echoId: localID.toString(),
      })
    );
  }
  content.value = "";
  attachments.value = [];
};

const onKeyDown = async (ev: KeyboardEvent) => {
  if (ev.key === "Enter" && !ev.shiftKey) {
    ev.preventDefault();
    await sendMessage();
  }
};

onStartTyping(() => {
  focus.value = !focus.value;
});
</script>
<template>
  <div class="flex flex-col">
    <attachments-list v-model="attachments" />
    <h-input
      v-model="content"
      class="dark:bg-harmonydark-700 dark:border-harmonydark-800"
      label="Send Message"
      :focus="focus"
      multiline
      @keydown="onKeyDown"
    >
      <template #pre-input>
        <attachment-btn v-model="attachments" />
      </template>
    </h-input>
  </div>
</template>
