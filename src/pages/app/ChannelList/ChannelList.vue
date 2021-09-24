<script setup lang="ts">
import ChannelListItem from "./ChannelListItem.vue";
import HList from "~/components/HList.vue";
import { useAppRoute } from "~/logic/location";
import { useChannelList } from "~/logic/api/api";

const route = useAppRoute();

const channelList = useChannelList(route.value.host, route.value.guildid);
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
