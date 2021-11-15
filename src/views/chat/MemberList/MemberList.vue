<script lang="ts" setup>
import { computed } from "vue";
import { chatState } from "../../../logic/store/chat";
import { useChatRoute } from "../../../router";
import MemberItem from "./MemberItem.vue";

const { host, guild } = useChatRoute();
const members = computed(
  () => chatState.getMemberList(host.value!, guild.value!),
  undefined
);
</script>

<template>
  <div class="w-48 flex flex-col bg-surface-800">
    <div class="p-2">
      <h3 class="text-sm uppercase text-gray-400">Members</h3>
    </div>
    <div class="bg-surface-900 flex-1">
      <ol class="overflow-hidden rounded-b-sm">
        <MemberItem class="gap-2" v-for="m in members" :key="m" :userid="m" />
      </ol>
    </div>
  </div>
</template>
