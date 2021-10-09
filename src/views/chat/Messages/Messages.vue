<script lang="ts" setup>
import { useChatRoute } from "../../../router";
import { computed, watch } from "vue";
import { chatState } from "../../../logic/store/chat";
import { connectionManager } from "~/logic/api/connections";
import { convertMessageV1 } from "~/logic/conversions/messages";
import Message from "./Message.vue";

const { host, guild, channel } = useChatRoute();
const channelData = computed(() =>
  chatState.getChannel(host.value!, guild.value!, channel.value!)
);
const messageList = computed(() => channelData.value.messageList);

watch(
  [host, guild, channel],
  async () => {
    if (channelData.value.messagesFetched) return;
    const { messages } = await connectionManager
      .get(host.value!)
      .chat.getChannelMessages({
        guildId: guild.value!,
        channelId: channel.value!,
        messageId: "0",
      }).response;
    messages.forEach(({ messageId, message }) =>
      chatState.setMessageData(
        host.value!,
        guild.value!,
        channel.value!,
        messageId,
        convertMessageV1(message!)
      )
    );
    chatState.setMessageList(
      host.value!,
      guild.value!,
      channel.value!,
      messages.map((m) => m.messageId)
    );
    channelData.value.messagesFetched = true;
  },
  { immediate: true }
);
</script>

<template>
  <div
    class="flex-1 flex flex-col bg-surface-800 p-3 gap-2 overflow-y-auto w-full"
  >
    <Message v-for="m in messageList" :key="m" :messageid="m" />
  </div>
</template>
