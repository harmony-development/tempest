<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import HBtn from "~/components/shared/HBtn.vue";
import { convertGuildEntryV1 } from "~/logic/conversions/guilds";
import { connectionManager } from "../../../logic/api/connections";
import { chatState } from "../../../logic/store/chat";
import { session } from "../../../logic/store/session";
import { uiState } from "../../../logic/store/ui";
import { useChatRoute } from "../../../router";
import AppSettings from "./AppSettings.vue";
import GuildIcon from "./GuildIcon.vue";

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
	chatState.state.guildList = guilds.map((guild) => convertGuildEntryV1(guild, session.value!.host));
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
			class="w-18 p-2 h-full overflow-y-scroll no-scrollbar z-1 relative bg-surface-900 flexcol gap-2 border-r-2 border-surface-800"
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
			<div class="flex-1 flexcol gap-2">
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
