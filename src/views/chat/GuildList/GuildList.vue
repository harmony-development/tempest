<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { chatState } from "../../../logic/store/chat";
import { session } from "../../../logic/store/session";
import { uiState } from "../../../logic/store/ui";
import { useChatRoute } from "../../../router";
import { useAPI } from "../../../services/api";
import AppSettings from "./AppSettings.vue";
import GuildIcon from "./GuildIcon.vue";
import { convertGuildEntryV1, convertGuildV1 } from "~/logic/conversions/guilds";
import BaseButton from "~/components/base/BaseButton.vue";

const { guild } = useChatRoute();
const router = useRouter();
const api = useAPI();

onMounted(async() => {
	const guilds = await api.fetchAllGuilds(session.value!.host);
	for (const guild of guilds) {
		const guildData = chatState.ensureGuild(guild.serverId, guild.guildId);
		guildData.data = convertGuildV1(guild);
	}
	chatState.state.guildList = guilds.map(guild => convertGuildEntryV1(guild));
});

const guildList = computed(() => chatState.state.guildList);

const goToGuild = (host: string, guildId: string) => {
	const guildObject = chatState.getGuild(host, guildId);
	router.push({
		name: "chat",
		params: {
			host: host || session.value!.host,
			guild: guildId,
			channel: guildObject.lastChannel,
		},
	});
};
</script>

<template>
  <div class="list">
    <div
      class="
				w-18
				p-2
				h-full
				overflow-y-scroll
				no-scrollbar
				z-1
				relative
				bg-surface-900
				flexcol
				gap-2
				border-r-2 border-surface-800
			"
    >
      <base-button
        variant="filled"
        color="primary"
        square
        aria-label="Create / Join Guild"
        @click="uiState.state.addGuildDialog = true"
      >
        <mdi-plus />
      </base-button>
      <hr class="border-gray-500">
      <div class="flex-1 flexcol gap-2">
        <guild-icon
          v-for="{ host, guildID } in guildList"
          :key="`${host}-${guildID}`"
          :active="guildID === guild"
          :host="host"
          :guildid="guildID"
          @click="goToGuild(host, guildID)"
        />
      </div>
      <app-settings />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.list {
	@apply h-full overflow-visible relative w-min;
}
</style>
