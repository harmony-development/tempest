<script lang="ts" setup>
import { computed } from "vue";
import { useAppRoute } from "~/logic/location";
import { appState } from "~/store/app";

const route = useAppRoute();

const channelName = computed(
  () =>
    appState.getChannel(route.value.host, route.value.channelid as string).name
);
</script>

<template>
  <mdi-pound class="text-xl text-gray-500 mr-1" />
  <h3 v-if="channelName">
    {{ channelName }}
  </h3>
</template>
