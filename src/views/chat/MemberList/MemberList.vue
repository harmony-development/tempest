<script lang="ts" setup>
import HListItem from "~/components/shared/HListItem.vue";
import HImg from "~/components/shared/HImg.vue";
import { computed, watch } from "vue";
import { chatState } from "../../../logic/store/chat";
import { useChatRoute } from "../../../router";
import Avatar from "~/components/chat/Avatar.vue";
import { connectionManager } from "../../../logic/api/connections";
import { asyncComputed } from "@vueuse/core";
import MemberItem from "./MemberItem.vue";

const { host, guild } = useChatRoute();
const members = asyncComputed(
  () => chatState.getMemberList(host.value!, guild.value!),
  undefined
);
</script>

<template>
  <div class="w-48 flex flex-col bg-surface-800">
    <div class="p-2">
      <h3 class="text-sm uppercase text-gray-400">Members</h3>
    </div>
    <ol class="bg-surface-900 flex-1">
      <MemberItem
        class="gap-2 rounded-md"
        v-for="m in members"
        :key="m"
        :userid="m"
      />
    </ol>
  </div>
</template>
