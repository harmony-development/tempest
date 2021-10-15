<script lang="ts" setup>
import { useChatRoute } from "../../../router";
import { computed, ref } from "vue";
import { chatState } from "../../../logic/store/chat";
import Message from "./Message.vue";
import { useIntersectionObserver } from "@vueuse/core";

const loader = ref<HTMLElement | undefined>();
const { host, guild, channel } = useChatRoute();
const messageList = computed(() =>
  chatState.getMessageList(host.value!, guild.value!, channel.value!)
);

useIntersectionObserver(loader, ([{ isIntersecting }]) => {
  if (isIntersecting) return;
});

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
      <mdi-loading class="text-xl animate-spin" ref="loader" />
      <Message
        v-for="(m, i) in messageList"
        :key="`${host}/${guild}/${channel}/${m}`"
        :messageid="m"
        :data="chatState.getMessage(host!, guild!, channel!, m)"
        :hide-avatar="isConsecutiveMessage(i)"
      />
    </div>
  </div>
</template>
