<script setup lang="ts">
import { computed, onMounted } from "vue";
import GuildIcon from "./guildicon.vue";
import { guildListState } from "~/store/guildList";
import { homeserverConn } from "~/logics/connections";

const guildList = computed(() => guildListState.getGuildList() || []);

onMounted(async () => {
  const conn = await homeserverConn();
  const resp = await conn.chat.GetGuildList({});
  guildListState.setGuildList(
    resp.guilds.map((g) => ({
      guildId: g.guildId!,
      host: g.host!,
    }))
  );
});
</script>

<template>
  <div class="bg-harmonydark-700 p-3">
    <guild-icon
      v-for="guild in guildList"
      :id="guild.guildId"
      :key="`${guild.guildId}:${guild.host}`"
      :host="guild.host"
    />
  </div>
</template>
