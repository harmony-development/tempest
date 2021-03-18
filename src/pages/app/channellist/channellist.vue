<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import ChannelListItem from "./channellistitem.vue";
import HList from "~/components/HList.vue";
import { getOrFederate } from "~/logics/connections";
import { appState } from "~/store/app";
import { useAppRoute } from "~/logics/location";
import type { IChannelData } from "~/store/types/channel";

const route = useAppRoute();

const channelList = computed(
  () =>
    appState.getGuild(route.value.host, route.value.guildid as string).channels
);

const fetchChannels = async () => {
  if (channelList.value) return;
  const conn = await getOrFederate(route.value.host);
  const resp = await conn.chat.getGuildChannels({
    guildId: route.value.guildid as string,
  });
  appState.setGuildChannels(
    route.value.host,
    route.value.guildid as string,
    resp.response.channels.map((c) => c.channelId)
  );
  appState.setChannelData(
    route.value.host,
    resp.response.channels.reduce<{
      [channelID: string]: IChannelData;
    }>((obj, c) => {
      obj[c.channelId] = {
        name: c.channelName,
        kind: "text",
        messages: [],
        unread: false,
        reachedTop: false,
        typing: {},
      };
      return obj;
    }, {})
  );
};

onMounted(async () => {
  await fetchChannels();
});

watch([route], async () => {
  console.log("hi");
  await fetchChannels();
});
</script>

<template>
  <h-list class="bg-harmonydark-800 flex-1 p-3">
    <channel-list-item
      v-for="channel in channelList"
      :id="channel"
      :key="channel"
    />
  </h-list>
</template>
