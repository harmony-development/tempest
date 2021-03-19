<script lang="ts" setup>
import { onMounted } from "vue";
import { getOrFederate } from "~/logics/connections";
import { useAppRoute } from "~/logics/location";
import { appState } from "~/store/app";

const route = useAppRoute();

const channel = appState.getChannel(
  route.value.host,
  route.value.channelid as string
);

onMounted(async () => {
  if (channel.messages) return;
  const conn = await getOrFederate(route.value.host);
  const resp = await conn.chat.getChannelMessages({
    channelId: route.value.channelid as string,
    guildId: route.value.guildid as string,
    beforeMessage: "0",
  });
});
</script>
<template>
  <h1 v-for="message in channel.messages" :key="message" />
</template>
