<script lang="ts" setup>
import Messages from "./messages/messages.vue";
import MsgInput from "./msginput/msginput.vue";
import { useAppRoute } from "~/logics/location";

const route = useAppRoute();
</script>
<template>
  <messages v-if="route.channelid" />
  <div v-else class="flex-1 flex justify-center items-center flex-col">
    <mdi-pound
      class="text-6xl rounded-full bg-gray-400 bg-opacity-30 p-3 mb-4"
    />
    <h1 v-t="'app.no-channel-selected'" class="text-xl text-blue-200"></h1>
  </div>
  <msg-input />
</template>
