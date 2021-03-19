<script lang="ts" setup>
import { onMounted } from "vue";
import MemberItem from "./memberitem.vue";
import { getOrFederate } from "~/logics/connections";
import { useAppRoute } from "~/logics/location";
import { appState } from "~/store/app";
import type { IUserData } from "~/store/types/user";

const route = useAppRoute();

const guild = appState.getGuild(
  route.value.host,
  route.value.guildid as string
);

onMounted(async () => {
  const conn = await getOrFederate(route.value.host);
  const members = await conn.chat.getGuildMembers({
    guildId: route.value.guildid as string,
  });
  const data = await conn.chat.getUserBulk({
    userIds: members.response.members.filter((v) => v !== "0"),
  });
  appState.setGuildMembers(
    route.value.host,
    route.value.guildid as string,
    members.response.members
  );
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
});
</script>

<template>
  <member-item v-for="member in guild.members" :key="member" :userid="member"
    >hi</member-item
  >
</template>
