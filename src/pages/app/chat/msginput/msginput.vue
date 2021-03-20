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

const onKeyDown = async (ev: KeyboardEvent) => {
  if (ev.key === "Enter" && !ev.shiftKey) {
    ev.preventDefault();
    const conn = await getOrFederate(route.value.host);
    await conn.chat.sendMessage(
      SendMessageRequest.create({
        guildId: route.value.guildid as string,
        channelId: route.value.channelid as string,
        content: content.value,
      })
    );
    content.value = "";
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
      ref="input"
      v-model="content"
      class="bg-harmonydark-700"
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
