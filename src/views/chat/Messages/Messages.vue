<script lang="ts" setup>
import { useChatRoute } from "../../../router";
import { computed, watch } from "vue";
import { chatState } from "../../../logic/store/chat";
import { connectionManager } from "~/logic/api/connections";
import { convertMessageV1 } from "~/logic/conversions/messages";
import Message from "./Message.vue";
import { useAsyncState } from "@vueuse/core";

const { host, guild, channel } = useChatRoute();
const channelData = computed(() =>
  chatState.getChannel(host.value!, guild.value!, channel.value!)
);
const { state: messageList } = useAsyncState(
  () => chatState.getMessageList(host.value!, guild.value!, channel.value!),
  undefined
);

const isConsecutiveMessage = (i: number) => {
  const currentHost = host.value!;
  const currentGuild = guild.value!;
  const currentChannel = channel.value!;

  const previousMessageId = messageList.value?.[i - 1];
  const currentMessageId = messageList.value?.[i];

  const previousMessage = chatState.getMessage(
    currentHost,
    currentGuild,
    currentChannel,
    previousMessageId!
  );
  const currentMessage = chatState.getMessage(
    currentHost,
    currentGuild,
    currentChannel,
    currentMessageId!
  );

  return currentMessage?.author === previousMessage?.author;
};
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
        :hide-avatar="isConsecutiveMessage(i)"
      />
    </div>
  </div>
</template>
