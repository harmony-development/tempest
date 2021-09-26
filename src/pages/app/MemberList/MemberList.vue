<script lang="ts" setup>
import MemberItem from "./MemberItem.vue";

import ProfileDropdown from "./ProfileDropdown.vue";
import { useAppRoute } from "~/logic/location";
import { useMemberList } from "~/logic/api/api";

const route = useAppRoute();
const host = computed(() => route.value.host);
const guildID = computed(() => route.value.guildid);
const members = useMemberList(host, guildID);
</script>

<template>
  <div class="bg-surface-800 w-full flex-1 p-2">
    <div class="bg-surface-900 rounded-lg h-full flex flex-col">
      <div class="flex-1">
        <member-item v-for="member in members" :key="member" :userid="member" />
      </div>
      <profile-dropdown />
    </div>
  </div>
</template>
