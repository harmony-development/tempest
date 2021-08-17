<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import ChannelListItem from "./channellistitem.vue";
import HList from "~/components/HList.vue";
import { appState } from "~/store/app";
import { useAppRoute } from "~/logic/location";
import { useFetchChannelList } from "~/logic/fetcher";

const route = useAppRoute();

const channelList = computed(
  () =>
    appState.getGuild(route.value.host, route.value.guildid as string).channels
);

const fetchChannels = useFetchChannelList();

onMounted(async () => {
  await fetchChannels(route.value.host, route.value.guildid);
});

watch(route, async (curr, prev) => {
  if (curr.guildid === prev.guildid && curr.host === prev.host) return;
  await fetchChannels(route.value.host, route.value.guildid);
});
</script>

<template>
  <h-list class="rounded-b-sm">
    <channel-list-item
      v-for="channel in channelList"
      :id="channel"
      :key="channel"
    />
  </h-list>
</template>
