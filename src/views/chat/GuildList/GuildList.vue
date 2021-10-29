<script lang="ts" setup>
import { computed, onMounted } from "vue";
import GuildIcon from "./GuildIcon.vue";
import { connectionManager } from "../../../logic/api/connections";
import { session } from "../../../logic/store/session";
import { chatState } from "../../../logic/store/chat";
import { convertGuildEntryV1 } from "~/logic/conversions/guilds";
import { useRouter } from "vue-router";
import HBtn from "~/components/shared/HBtn.vue";
import { useChatRoute } from "../../../router";
import { uiState } from "../../../logic/store/ui";
import AppSettings from "./AppSettings.vue";

const { guild } = useChatRoute();
const router = useRouter();

onMounted(async () => {
  const conn = connectionManager.get(session.value!.host);
  const { guilds } = await conn.chat.getGuildList({}).response;
  guilds.forEach(async (entry) => {
    connectionManager.getStream(entry.serverId).requests.send({
      request: {
        oneofKind: "subscribeToGuild",
        subscribeToGuild: {
          guildId: entry.guildId,
        },
      },
    });
  });
  chatState.state.guildList = guilds.map((guild) =>
    convertGuildEntryV1(guild, session.value!.host)
  );
});

const guildList = computed(() => chatState.state.guildList);

const goToGuild = (host: string, guild: string) => {
  router.push({
    name: "chat",
    params: {
      host: host || session.value!.host,
      guild,
    },
  });
};
</script>

<template>
  <div class="list">
    <div
      class="w-18 p-2 h-full overflow-y-scroll no-scrollbar z-1 relative bg-surface-800 flex flex-col gap-2"
    >
      <HBtn
        variant="filled"
        color="primary"
        square
        @click="uiState.state.addGuildDialog = true"
        aria-label="Create / Join Guild"
      >
        <mdi-plus />
      </HBtn>
      <hr class="border-gray-500" />
      <div class="flex-1 flex flex-col gap-2">
        <GuildIcon
          v-for="{ host, guildID } in guildList"
          :key="`${host}-${guildID}`"
          :active="guildID === guild"
          :host="host"
          :guildid="guildID"
          @click="goToGuild(host, guildID)"
        />
      </div>
      <AppSettings />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.list {
  @apply h-full overflow-visible relative w-min;
}
</style>
