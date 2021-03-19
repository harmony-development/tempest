<script lang="ts" setup>
import { computed, onMounted, watch } from "vue";
import Message from "./message.vue";
import { getOrFederate } from "~/logics/connections";
import { useAppRoute } from "~/logics/location";
import { appState } from "~/store/app";
import type { IMessageData } from "~/store/types/message";

const route = useAppRoute();

const channel = computed(() =>
  appState.getChannel(route.value.host, route.value.channelid as string)
);

const fetchMessages = async () => {
  if (channel.value.messages) return;
  const conn = await getOrFederate(route.value.host);
  const resp = await conn.chat.getChannelMessages({
    channelId: route.value.channelid as string,
    guildId: route.value.guildid as string,
    beforeMessage: "0",
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
    resp.response.messages.map((msg) => msg.messageId).reverse()
  );
};

onMounted(async () => {
  await fetchMessages();
});

watch(route, async (curr, prev) => {
  if (curr.channelid === prev.channelid && curr.host === prev.host) return;
  await fetchMessages();
});
</script>
<template>
  <message
    v-for="message in channel.messages"
    :key="message"
    :messageid="message"
  />
</template>
