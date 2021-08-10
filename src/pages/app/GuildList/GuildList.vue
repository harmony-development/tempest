<script setup lang="ts">
import { computed, onMounted } from "vue";
import GuildIcon from "./guildicon.vue";
import GuildBtn from "./GuildBtn.vue";
import { guildListState } from "~/store/guildList";
import { getStream, homeserverConn } from "~/logics/connections";
import { host } from "~/logics/app";

const guildList = computed(() => guildListState.getGuildList() || []);

onMounted(async () => {
  const conn = await homeserverConn();
  const resp = await conn.chat.getGuildList({});
  resp.response.guilds.forEach(async (g) => {
    const stream = await getStream(g.host || host.value);
    stream.request.send({
      request: {
        oneofKind: "subscribeToGuild",
        subscribeToGuild: {
          guildId: g.guildId,
        },
      },
    });
  });
  guildListState.setGuildList(
    resp.response.guilds.map((g) => ({
      guildId: g.guildId,
      host: g.host || host.value,
    }))
  );
});
</script>

<template>
  <div class="bg-white dark:bg-harmonydark-700 p-2 flex flex-col gap-2">
    <template
      v-for="guild in guildList"
      :key="`${guild.guildId}:${guild.host}`"
    >
      <guild-icon :id="guild.guildId" :host="guild.host" />
      <hr class="border-harmonydark-500" />
    </template>
    <guild-btn />
  </div>
</template>
