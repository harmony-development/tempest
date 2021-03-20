<script lang="ts" setup>
import { computed, onMounted, watch } from "vue";
import MemberItem from "./memberitem.vue";
import { getOrFederate } from "~/logics/connections";
import { useAppRoute } from "~/logics/location";
import { appState } from "~/store/app";
import type { IUserData } from "~/store/types/user";

const route = useAppRoute();

const members = computed(
  () =>
    appState.getGuild(route.value.host, route.value.guildid as string).members
);

const fetchMembers = async () => {
  if (!route.value.host || !route.value.guildid) return;
  const conn = await getOrFederate(route.value.host);
  const members = await conn.chat.getGuildMembers({
    guildId: route.value.guildid as string,
  });
  const data = await conn.chat.getUserBulk({
    userIds: members.response.members.filter((v) => v !== "0"),
  });
  appState.setUserData(
    route.value.host,
    data.response.users.reduce<{
      [userid: string]: IUserData;
    }>((obj, u, idx) => {
      obj[members.response.members[idx]] = {
        username: u.userName,
        avatar: u.userAvatar,
        status: u.userStatus,
        bot: u.isBot,
      };
      return obj;
    }, {})
  );
  appState.setGuildMembers(
    route.value.host,
    route.value.guildid as string,
    members.response.members
  );
};

onMounted(async () => {
  if (!members.value) await fetchMembers();
});

watch(route, async (val, old) => {
  if (!members.value && (val.guildid !== old.guildid || val.host !== old.host))
    await fetchMembers();
});
</script>

<template>
  <div class="bg-harmonydark-800 w-full flex-1 p-3">
    <member-item v-for="member in members" :key="member" :userid="member"
      >hi</member-item
    >
  </div>
</template>
