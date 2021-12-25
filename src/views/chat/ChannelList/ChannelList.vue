<script lang="ts" setup>
import { computed, watchEffect } from "vue";
import { chatState } from "../../../logic/store/chat";
import { uiState } from "../../../logic/store/ui";
import { useChatRoute } from "../../../router";
import ChannelItem from "./ChannelItem.vue";

const { host, guild } = useChatRoute();

const data = computed(() => chatState.getGuild(host.value!, guild.value!), undefined);

watchEffect(() => chatState.getChannelList(host.value!, guild.value!));
</script>

<template>
  <div class="w-48 bg-surface-900 border-surface-900 flexcol">
    <div class="p-2 h-12 text-base bg-surface-700 gap-1 flex items-center">
      <p class="font-bold text-sm overflow-ellipsis overflow-hidden truncate">
        {{ data?.data?.name }}
      </p>
      <base-button
        icon
        dense
        style="aspect-ratio: 1/1"
        class="text-sm"
        aria-label="Guild Settings"
        @click="uiState.state.guildSettingsDialog = true"
      >
        <mdi-cog />
      </base-button>
    </div>
    <div class="flex items-center justify-between p-2 text-sm">
      <p class="text-xs uppercase text-gray-400">
        channels
      </p>
      <base-button icon dense aria-label="Add Channel" @click="uiState.state.addChannelDialog = true">
        <mdi-plus />
      </base-button>
    </div>
    <div class="flex-1 bg-surface-900 text-xs overflow-auto compact-scrollbar border-r-2 border-surface-800">
      <ol>
        <channel-item v-for="c in data?.channelList" :key="`${guild}${c}`" :channelid="c" />
      </ol>
    </div>
  </div>
</template>
