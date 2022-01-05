<script lang="ts" setup>
import { computed, watch, watchEffect } from "vue";
import { chatState } from "../../../logic/store/chat";
import { uiState } from "../../../logic/store/ui";
import { useChatRoute } from "../../../router";
import { useAPI } from "../../../services/api";
import ChannelItem from "./ChannelItem.vue";
import BaseButton from "~/components/base/BaseButton.vue";
import BaseTooltip from "~/components/base/BaseTooltip.vue";

const { host: selectedHost, guild: selectedGuild } = useChatRoute();
const api = useAPI();

const guild = computed(() => chatState.getGuild(selectedHost.value!, selectedGuild.value!), undefined);
const data = computed(() => guild.value.data);

watch([selectedHost, selectedGuild], ([host, guild], [prevHost, prevGuild]) => {
	if (host === prevHost && guild === prevGuild) return;
	api.fetchChannelList(host!, guild!);
}, { immediate: true });
</script>

<template>
  <div class="w-48 bg-surface-900 border-surface-900 flexcol overflow-auto compact-scrollbar">
    <div class="p-2 h-12 text-base bg-surface-700 gap-1 flex items-center">
      <p class="font-bold text-sm overflow-ellipsis overflow-hidden truncate w-full">
        {{ data?.name }}
      </p>
      <base-tooltip text="Guild Settings">
        <base-button
          icon
          dense
          aria-label="Guild Settings"
          @click="uiState.state.guildSettingsDialog = true"
        >
          <mdi-cog />
        </base-button>
      </base-tooltip>
    </div>
    <div class="flex items-center justify-between p-2 ">
      <p class="text-xs uppercase text-gray-400">
        channels
      </p>
      <base-tooltip text="Add Channel">
        <base-button icon dense aria-label="Add Channel" @click="uiState.state.addChannelDialog = true">
          <mdi-plus />
        </base-button>
      </base-tooltip>
    </div>
    <div class="flex-1 bg-surface-900 text-xs border-r-2 border-surface-800">
      <ol class="overflow-hidden">
        <channel-item v-for="c in guild.channelList" :key="`${guild}${c}`" :channelid="c" />
      </ol>
    </div>
  </div>
</template>
