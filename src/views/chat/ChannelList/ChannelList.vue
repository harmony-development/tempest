<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { chatState } from "../../../logic/store/chat";
import { useChatRoute } from "../../../router";
import HBtn from "~/components/shared/HBtn.vue";
import HListItem from "~/components/shared/HListItem.vue";
import { uiState } from "../../../logic/store/ui";

const route = useChatRoute();

const guildData = computed(() =>
  chatState.getGuild(route.params.host!, route.params.guild!)
);

onMounted(() => {});
</script>

<template>
  <div class="w-48 bg-surface-800 border-l-3 border-surface-900 flex flex-col">
    <div
      class="p-2 text-md bg-surface-900 flex items-center"
      v-if="route.params.guild"
    >
      <p class="font-bold overflow-ellipsis overflow-hidden">
        {{ guildData.name }}
      </p>
      <div class="flex-1" />
      <h-btn
        icon
        dense
        class="text-xs"
        @click="uiState.state.guildSettingsDialog = true"
      >
        <mdi-cog />
      </h-btn>
    </div>
    <div class="flex items-center justify-between p-2 text-xs">
      <p class="uppercase text-gray-400">channels</p>
      <h-btn icon dense @click="uiState.state.addChannelDialog = true">
        <mdi-plus />
      </h-btn>
    </div>
    <div class="flex-1 bg-surface-700 text-xs overflow-auto compact-scrollbar">
      <ol>
        <h-list-item> </h-list-item>
      </ol>
    </div>
  </div>
</template>
