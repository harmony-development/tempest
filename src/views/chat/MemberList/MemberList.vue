<script lang="ts" setup>
import { computed } from "vue";
import { chatState } from "../../../logic/store/chat";
import { session } from "../../../logic/store/session";
import { useChatRoute } from "../../../router";
import MemberItem from "./MemberItem.vue";
import { uiState } from "~/logic/store/ui";

const { host, guild } = useChatRoute();
const members = computed(() => chatState.getMemberList(host.value!, guild.value!), undefined);
const ownUserID = computed(() => session.value?.userID);
</script>

<template>
  <div class="w-48 flexcol bg-surface-900 border-l-2 border-surface-800">
    <div class="h-12 flex items-center p-3">
      <h3 class="text-xs uppercase text-gray-400">
        Members
      </h3>
    </div>
    <div class="flex-1 h-full overflow-auto compact-scrollbar">
      <ol class="rounded-b-sm">
        <member-item v-for="m in members" :key="m" class="gap-2" :userid="m" />
      </ol>
    </div>
    <member-item class="gap-2 bg-surface-800 border-t-2 border-surface-300" :userid="ownUserID!" @click="uiState.state.userSettingsDialog = true" />
  </div>
</template>
