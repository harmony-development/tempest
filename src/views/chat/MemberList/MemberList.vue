<script lang="ts" setup>
import { computed } from "vue";
import { chatState } from "../../../logic/store/chat";
import { useChatRoute } from "../../../router";
import MemberItem from "./MemberItem.vue";
import { session } from '../../../logic/store/session';
import { uiState } from '~/logic/store/ui';

const { host, guild } = useChatRoute();
const members = computed(
  () => chatState.getMemberList(host.value!, guild.value!),
  undefined
);
const ownUserID = computed(() => session.value?.userID);
</script>

<template>
  <div class="w-48 flex flex-col bg-surface-900 border-l-2 border-surface-800">
    <div class="h-12 flex items-center p-3">
      <h3 class="text-sm uppercase text-gray-400">Members</h3>
    </div>
    <div class="flex-1">
      <ol class="overflow-hidden rounded-b-sm">
        <MemberItem class="gap-2" v-for="m in members" :key="m" :userid="m" />
      </ol>
    </div>
    <MemberItem
      class="gap-2"
      :userid="ownUserID!"
      @click="uiState.state.userSettingsDialog = true"
    />
  </div>
</template>
