<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";
import { getOrFederate } from "~/logics/connections";

const props = defineProps<{
  host: string;
  id: string;
}>();

const leaveGuild = async () => {
  const conn = await getOrFederate(props.host);
  await conn.chat.leaveGuild({
    guildId: props.id,
  });
};
</script>

<template>
  <h-list class="bg-black w-max">
    <h-list-item class="text-red-500" @click="leaveGuild">
      Leave Guild
    </h-list-item>
  </h-list>
</template>
