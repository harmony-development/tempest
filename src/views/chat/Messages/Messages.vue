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
    const currentHost = host.value;
    const currentGuild = guild.value;
    const currentChannel = channel.value;
    if (!currentHost || !currentGuild || !currentChannel) return;
    if (channelData.value.messagesFetched) return;
    const { messages } = await connectionManager
      .get(currentHost!)
      .chat.getChannelMessages({
        guildId: currentGuild!,
        channelId: currentChannel!,
        messageId: "0",
      }).response;
    messages.reverse();
    for (const { messageId, message } of messages) {
      chatState.setMessageData(
        currentHost!,
        currentGuild!,
        currentChannel!,
        messageId,
        convertMessageV1(message!)
      );
    }
    chatState.setMessageList(
      currentHost!,
      currentGuild!,
      currentChannel!,
      messages.map((m) => m.messageId)
    );
    channelData.value.messagesFetched = true;
  },
  { immediate: true }
);
</script>

<template>
  <div
    class="
      flex-1 flex
      justify-center
      bg-surface-800
      p-3
      gap-2
      overflow-y-auto
      w-full
      compact-scrollbar
    "
  >
    <div class="flex flex-col flex-1 gap-2">
      <Message
        v-for="(m, i) in messageList"
        :key="`${channel}/${m}`"
        :messageid="m"
        :hide-avatar="
          channelData.messages[messageList[i]]?.author ===
          channelData.messages[messageList[i - 1]]?.author
        "
      />
    </div>
  </div>
</template>
