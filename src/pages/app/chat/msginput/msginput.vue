<script lang="ts" setup>
import { SendMessageRequest } from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/chat/v1/messages";

import { ref } from "vue";
import HInput from "~/components/HInput.vue";
import { getOrFederate } from "~/logics/connections";
import { useAppRoute } from "~/logics/location";

const content = ref("");
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
</script>
<template>
  <h-input
    v-model="content"
    class="bg-harmonydark-700"
    label="Send Message"
    @keydown="onKeyDown"
  />
</template>
