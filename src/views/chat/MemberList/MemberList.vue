<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { chatState } from "../../../logic/store/chat";
import { session } from "../../../logic/store/session";
import { useChatRoute } from "../../../router";
import MemberItem from "./MemberItem.vue";
import { uiState } from "~/logic/store/ui";
import BaseListItem from "~/components/base/BaseListItem.vue";

const { host, guild } = useChatRoute();
const router = useRouter();
const members = computed(() => chatState.getMemberList(host.value!, guild.value!), undefined);
const ownUserID = computed(() => session.value?.userID);

const openDialog = () => uiState.state.userSettingsDialog = true;
const logOut = async() => {
	await router.push({
		name: "serverselect",
	});
	session.value = undefined;
};
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
    <base-menu v-if="ownUserID" placement="top" match-width :offset="0">
      <template #activator="{activate}">
        <member-item :userid="ownUserID" @click="activate" />
      </template>
      <!-- <mdi-chevron-down
        class="transform transition duration-100"
        :class="[open && 'rotate-180']"
      /> -->
      <ul class="bg-surface-600">
        <base-list-item @click="openDialog">
          <template #icon>
            <mdi-cog />
          </template>
          Settings
        </base-list-item>
        <base-list-item @click="logOut">
          <template #icon>
            <mdi-skull />
          </template>
          Log Out
        </base-list-item>
      </ul>
    </base-menu>
  </div>
</template>
