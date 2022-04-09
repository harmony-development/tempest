<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import BaseButton from "~/components/base/BaseButton.vue";
import { convertGuildV1 } from "~/logic/conversions/guilds";
import { chatState } from "../../../logic/store/chat";
import { session } from "../../../logic/store/session";
import { uiState } from "../../../logic/store/ui";
import { useChatRoute } from "../../../router";
import { useAPI } from "../../../services/api";
import AppSettings from "./AppSettings.vue";
import GuildIcon from "./GuildIcon.vue";

const { guild } = useChatRoute();
const router = useRouter();
const api = useAPI();

onMounted(async () => {
	const [guilds, guildList] = await api.fetchAllGuilds(session.value!.host);
	for (const guild of guilds) {
		const guildData = chatState.ensureGuild(guild.serverId, guild.guildId);
		guildData.data = convertGuildV1(guild);
	}
	chatState.state.guildList = guildList.map((e) => ({ guildID: e.guildId, host: e.serverId || "" }));
});

const guildList = computed(() => chatState.state.guildList);

const goToGuild = async (host: string, guildId: string) => {
	const guildObject = chatState.getGuild(host, guildId);
	await router.push({
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
		<div class="w-18 p-2 h-full overflow-y-scroll no-scrollbar z-1 relative bg-surface-900 flexcol gap-2 border-r-2 border-surface-800">
			<base-button
				raw
				square
				variant="filled"
				color="primary"
				class="rounded-xl"
				:aria-label="$t('create-join-guild')"
				@click="uiState.state.addGuildDialog = true"
			>
				<mdi-plus />
			</base-button>
			<hr class="border-gray-500" />
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
