<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import HAppBar from "~/components/shared/HAppBar.vue";
import HBtn from "~/components/shared/HBtn.vue";
import HDialog from "~/components/shared/HDialog.vue";
import HDrawer from "~/components/shared/HDrawer.vue";
import { pubsub } from "~/logic/api/pubsub";
import { connectionManager } from "../../logic/api/connections";
import { chatState } from "../../logic/store/chat";
import { session } from "../../logic/store/session";
import { uiState } from "../../logic/store/ui";
import { useChatRoute } from "../../router";
import ChannelList from "./ChannelList/ChannelList.vue";
import Composer from "./Composer/Composer.vue";
import UserSettings from "./Dialogs/UserSettings.vue";
import GuildList from "./GuildList/GuildList.vue";
import MemberList from "./MemberList/MemberList.vue";
import Messages from "./Messages/Messages.vue";
import Splash from "./Splash.vue";

const AddGuild = defineAsyncComponent(() => import("./Dialogs/AddGuild.vue"));
const AddChannel = defineAsyncComponent(() => import("./Dialogs/AddChannel.vue"));

const sessionValidated = ref(false);
const leftDrawer = ref(false);
const rightDrawer = ref(false);
const router = useRouter();
const { host, guild, channel } = useChatRoute();

const channelData = computed(() => chatState.getChannel(host.value!, guild.value!, channel.value!));

onMounted(async () => {
	const [conn, stream] = connectionManager.create(session.value!.host, session.value!.session);
	try {
		await conn.auth.checkLoggedIn({});
		sessionValidated.value = true;
		const handler = pubsub(session.value!.host);
		stream.requests.send({
			request: {
				oneofKind: "subscribeToHomeserverEvents",
				subscribeToHomeserverEvents: {},
			},
		});
		stream.responses.onMessage(handler);
	} catch (e) {
		router.push({ name: "serverselect" });
	}
});

watch(guild, () => {
	const guildObject = chatState.getGuild(host.value!, guild.value!);
	guildObject.lastChannel && router.push({ params: { channel: guildObject.lastChannel } });
});
</script>

<template>
	<Splash v-if="!sessionValidated" />
	<div class="h-full w-full flex" v-else>
		<HDialog v-model="uiState.state.addGuildDialog">
			<AddGuild v-if="uiState.state.addGuildDialog" />
		</HDialog>
		<HDialog v-model="uiState.state.addChannelDialog">
			<AddChannel v-if="uiState.state.addChannelDialog" />
		</HDialog>
		<HDialog v-model="uiState.state.userSettingsDialog">
			<UserSettings v-if="uiState.state.userSettingsDialog" />
		</HDialog>
		<HDrawer v-model="leftDrawer">
			<div class="flex h-full">
				<GuildList />
				<ChannelList v-if="guild" />
			</div>
		</HDrawer>
		<div class="bg-surface-900 flex-1 flexcol">
			<h-app-bar class="bg-surface-700 h-12 text-sm font-semibold">
				<h-btn variant="text" icon dense class="!lg:hidden mr-2" @click="leftDrawer = true" aria-label="Left Drawer">
					<mdi-menu />
				</h-btn>
				<mdi-pound class="text-lg mr-2 text-gray-400" />
				{{ channelData.data?.name }}
				<div class="flex-1" />
				<h-btn variant="text" icon dense class="!lg:hidden" @click="rightDrawer = true" aria-label="Right Drawer">
					<mdi-account-multiple />
				</h-btn>
			</h-app-bar>
			<template v-if="host && guild && channel">
				<Messages :host="host" :guild="guild" :channel="channel" />
				<Composer />
			</template>
			<div class="flex-1 flexcol gap-4 justify-center items-center" v-else>
				<div class="bg-surface-800 rounded-full p-2">
					<mdi-pound class="text-5xl align-top text-gray-300" />
				</div>
				<div class="bg-surface-800 rounded-full p-2 px-4">
					<p v-if="guild">Select a channel to start chatting</p>
					<p v-else>Select a guild to get started</p>
				</div>
			</div>
		</div>
		<HDrawer v-model="rightDrawer" right>
			<div class="flex h-full">
				<MemberList v-if="guild" />
			</div>
		</HDrawer>
	</div>
</template>
