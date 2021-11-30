<script setup lang="ts">
import { useI18n } from "vue-i18n";
import ChannelListItem from "./ChannelListItem.vue";
import HList from "~/components/HList.vue";
import { useAppRoute } from "~/logic/location";
import { useChannelList } from "~/logic/api/api";

const route = useAppRoute();
const { t } = useI18n();

const error = ref<unknown>();

const host = computed(() => route.value.host);
const guildid = computed(() => route.value.guildid);

const channelList = useChannelList(host, guildid, error);
</script>

<template>
  <h-list class="rounded-b-sm">
    <div v-if="error" class="text-center p-4 text-gray-300">
      <mdi-alert class="text-xl" /> <br />
      <p>{{ t("app.channels.error") }}</p>
      <p class="italic text-gray-500 mt-3">{{ error }}</p>
    </div>
    <channel-list-item
      v-for="channel in channelList"
      :id="channel"
      :key="channel"
    />
  </h-list>
</template>
