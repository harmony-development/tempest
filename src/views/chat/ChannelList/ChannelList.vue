<script lang="ts" setup>
import { computed, onMounted, watchEffect, watch } from "vue";
import { chatState } from "../../../logic/store/chat";
import { useChatRoute } from "../../../router";
import HBtn from "~/components/shared/HBtn.vue";
import { uiState } from "../../../logic/store/ui";
import ChannelItem from "./ChannelItem.vue";
import { useAsyncState } from "@vueuse/core";

const { host, guild } = useChatRoute();

const { state: data } = useAsyncState(
  () => chatState.getGuild(host.value!, guild.value!),
  undefined
);

watchEffect(() => chatState.getChannelList(host.value!, guild.value!));
</script>

<template>
  <div class="w-48 bg-surface-800 border-l-3 border-surface-900 flex flex-col">
    <div class="p-2 text-base bg-surface-900 flex items-center">
      <p class="font-bold overflow-ellipsis overflow-hidden">
        {{ data?.data?.name }}
      </p>
      <div class="flex-1" />
      <h-btn
        icon
        dense
        class="text-xs"
        @click="uiState.state.guildSettingsDialog = true"
        aria-label="Guild Settings"
      >
        <mdi-cog />
      </h-btn>
    </div>
    <div class="flex items-center justify-between p-2 text-xs">
      <p class="uppercase text-gray-400">channels</p>
      <h-btn
        icon
        dense
        @click="uiState.state.addChannelDialog = true"
        aria-label="Add Channel"
      >
        <mdi-plus />
      </h-btn>
    </div>
    <div class="flex-1 bg-surface-700 text-xs overflow-auto compact-scrollbar">
      <ol>
        <channel-item
          v-for="c in data?.channelList"
          :key="`${guild}${c}`"
          :channelid="c"
        />
      </ol>
    </div>
  </div>
</template>
