<script lang="ts" setup>
import Messages from "./messages/messages.vue";
import MsgInput from "./msginput/msginput.vue";
import { useAppRoute } from "~/logic/location";

const route = useAppRoute();
</script>
<template>
  <div class="flex-1 flex flex-col items-center overflow-hidden">
    <messages v-if="route.channelid" />
    <div v-else class="flex-1 flex justify-center items-center flex-col">
      <mdi-pound class="text-6xl rounded-full bg-surface-700 p-3 mb-4" />
      <div class="bg-surface-700 p-2 px-4 rounded-full">
        <h1 v-t="'app.no-channel-selected'" class="text-xl"></h1>
      </div>
    </div>
  </div>
  <msg-input />
</template>
