<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useEventListener, useThrottleFn } from "@vueuse/core";
import Message from "./message.vue";
import HCircularProgress from "~/components/HCircularProgress.vue";
import { getOrFederate } from "~/logics/connections";
import { useAppRoute } from "~/logics/location";
import { appState } from "~/store/app";
import type { IMessageData } from "~/store/types/message";

const route = useAppRoute();

const messagesContainer = ref<HTMLDivElement | undefined>(undefined);

const messages = computed(
  () =>
    appState.getChannel(route.value.host, route.value.channelid as string)
      .messages
);

const scrollToBottom = () => {
  if (messagesContainer.value)
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
};

const fetchMessages = async (msgID?: string) => {
  if (messages.value && !msgID) return;
  const conn = await getOrFederate(route.value.host);
  const resp = await conn.chat.getChannelMessages({
    channelId: route.value.channelid as string,
    guildId: route.value.guildid as string,
    beforeMessage: msgID || "0",
  });
  appState.setMessageData(
    route.value.host,
    resp.response.messages.reduce<{
      [messageID: string]: IMessageData;
    }>((obj, m) => {
      obj[m.messageId] = {
        author: m.authorId,
        createdAt: Number(m.createdAt?.seconds),
        editedAt: Number(m.editedAt?.seconds),
        content: m.content,
        pending: false,
      };
      return obj;
    }, {})
  );
  appState.setChannelMessages(
    route.value.host,
    route.value.channelid as string,
    resp.response.messages.map((msg) => msg.messageId).reverse(),
    !!msgID
  );
};

onMounted(async () => {
  await fetchMessages();
  await nextTick();
  scrollToBottom();
});

watch(route, async (curr, prev) => {
  if (curr.channelid === prev.channelid && curr.host === prev.host) return;
  await fetchMessages();
  await nextTick();
  scrollToBottom();
});

watch(
  messages,
  async () => {
    if (messagesContainer.value) {
      if (
        messagesContainer.value.scrollHeight -
          messagesContainer.value.offsetHeight -
          messagesContainer.value.scrollTop <=
        200
      ) {
        await nextTick();
        scrollToBottom();
      }
    }
  },
  { deep: true }
);

const scrollHandler = useThrottleFn(async (ev: Event) => {
  const target = ev.target as HTMLDivElement;
  const previousScrollPos = target.scrollHeight - target.scrollTop;
  if (target.scrollTop === 0) {
    await fetchMessages(messages.value?.[0]);
    await nextTick();
    target.scrollTop = target.scrollHeight - previousScrollPos;
  }
}, 200);

useEventListener(messagesContainer, "scroll", scrollHandler);
</script>
<template>
  <div ref="messagesContainer" class="flex-1 p-4 overflow-x-auto">
    <h-circular-progress class="my-1 text-center w-full" />
    <message v-for="message in messages" :key="message" :messageid="message" />
  </div>
</template>
