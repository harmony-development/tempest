<script lang="ts" setup>
import { SendMessageRequest } from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/chat/v1/messages";
import { onStartTyping } from "@vueuse/core";

import { ref } from "vue";
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

interface UploadedFile {
  name: string;
  contentType: string;
  id: string;
  size: number;
}

const uploadFile = async (f: File, session: string) => {
  const url = new URL(`${route.value.host}/_harmony/media/upload`);
  url.searchParams.set("filename", f.name);
  url.searchParams.set("contentType", f.type || "text/plain");
  const data = new FormData();
  data.set("file", f);
  const headers = new Headers();
  headers.set("Authorization", session || "");
  const resp = await fetch(url.toString(), {
    body: data,
    method: "POST",
    headers,
  });
  const asJSON = await resp.json();
  return {
    name: f.name,
    contentType: f.type,
    id: asJSON.id,
    size: f.size,
  } as UploadedFile;
};

const sendMessage = async () => {
  const localID = Math.floor(Math.random() * 1000);
  const conn = await getOrFederate(route.value.host);
  let uploadAttachments = undefined as UploadedFile[] | undefined;
  let uploadPromises = [] as Promise<void>[];
  if (attachments.value.length > 0) {
    uploadAttachments = [];
    uploadPromises = attachments.value.map(async (f) => {
      const resp = await uploadFile(f.file, conn.getSession()!);
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
