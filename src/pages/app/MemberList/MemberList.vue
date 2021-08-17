<script lang="ts" setup>
import { onMounted, watch } from "vue";
import MemberItem from "./MemberItem.vue";

import ProfileDropdown from "./ProfileDropdown.vue";
import { useFetchMembers, useMemberList } from "~/logic/fetcher";
import { useAppRoute } from "~/logic/location";

const fetchMembers = useFetchMembers();
const members = useMemberList();
const route = useAppRoute();

onMounted(async () => {
  if (!members.value) await fetchMembers(route.value.host, route.value.guildid);
});

watch(route, async (val, old) => {
  if (!members.value && (val.guildid !== old.guildid || val.host !== old.host))
    await fetchMembers(route.value.host, route.value.guildid);
});
</script>

<template>
  <div class="bg-white dark:bg-harmonydark-800 w-full flex-1 p-2">
    <div
      class="
        bg-light-300
        dark:bg-harmonydark-900
        rounded-lg
        h-full
        flex flex-col
      "
    >
      <div class="flex-1">
        <member-item v-for="member in members" :key="member" :userid="member" />
      </div>
      <profile-dropdown />
    </div>
  </div>
</template>
