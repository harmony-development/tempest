<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";
import { getOrFederate, homeserverConn } from "~/logics/connections";

const props = defineProps<{
  host: string;
  id: string;
}>();

const leaveGuild = async () => {
  const conn = await getOrFederate(props.host);
  const local = await homeserverConn();
  await conn.chat.leaveGuild({
    guildId: props.id,
  });
  await local.chat.removeGuildFromGuildList({
    guildId: props.id,
    homeserver: props.host,
  });
};
</script>

<template>
  <h-list class="bg-black">
    <h-list-item class="text-red-500" @click="leaveGuild">
      Leave Guild
    </h-list-item>
  </h-list>
</template>
