<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { connectionManager } from "../../../logic/api/connections";
import { chatState } from "../../../logic/store/chat";
import { session } from "../../../logic/store/session";
import { uiState } from "../../../logic/store/ui";
import { useChatRoute } from "../../../router";
import AppSettings from "./AppSettings.vue";
import GuildIcon from "./GuildIcon.vue";
import { convertGuildEntryV1, convertGuildV1 } from "~/logic/conversions/guilds";
import BaseButton from "~/components/base/BaseButton.vue";
import { batchGetGuild } from "~/logic/api/batchHack";

const { guild } = useChatRoute();
const router = useRouter();

onMounted(async() => {
	const conn = connectionManager.get(session.value!.host);
	const { guilds } = await conn.chat.getGuildList({}).response;
	guilds.forEach(async(entry) => {
		connectionManager.getStream(entry.serverId).requests.send({
			request: {
				oneofKind: "subscribeToGuild",
				subscribeToGuild: {
					guildId: entry.guildId,
				},
			},
		});
	});

	const collected = guilds.reduce<{
		[host: string]: string[]
	}>((acc, current) => {
		if (!acc[current.serverId]) acc[current.serverId] = [];
		acc[current.serverId].push(current.guildId);
		return acc;
	}, {});

	await Promise.all(
		Object.entries(collected).map(async([host, guildIds]) => {
			const guilds = await batchGetGuild(connectionManager.get(host), guildIds);
			const hostData = chatState.ensureHost(host);
			guilds.forEach((guild, i) => {
				const guildData = chatState.ensureGuild(host, guildIds[i]);
				Object.assign(guildData, {
					name: guild!.name,
					picture: guild?.picture,
					owners: guild!.ownerIds,
				});
				chatState.lock.add("guild", host, guildIds[i]);
			});
		}),
	);

	chatState.state.guildList = guilds.map(guild => convertGuildEntryV1(guild, session.value!.host));
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
