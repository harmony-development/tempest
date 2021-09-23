<script setup lang="ts">
import GuildIcon from "./GuildIcon.vue";
import GuildBtn from "./GuildBtn.vue";
import { getStream } from "~/logic/connections";
import { host } from "~/logic/app";
import { useGuildList } from "~/logic/api/api";

const guildList = useGuildList(host.value);

watch(guildList, (guilds) => {
  guilds?.forEach(async (g) => {
    const stream = await getStream(g.host || host.value);
    stream?.request.send({
      request: {
        oneofKind: "subscribeToGuild",
        subscribeToGuild: {
          guildId: g.guildId,
        },
      },
    });
  });
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
