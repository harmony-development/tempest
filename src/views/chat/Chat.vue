<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
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
import { pubsub } from "~/logic/api/pubsub";
import BaseDrawer from "~/components/base/BaseDrawer.vue";
import BaseDialog from "~/components/base/BaseDialog.vue";
import BaseButton from "~/components/base/BaseButton.vue";
import BaseAppBar from "~/components/base/BaseAppBar.vue";

const AddGuild = defineAsyncComponent(() => import("./Dialogs/AddGuild.vue"));
const AddChannel = defineAsyncComponent(() => import("./Dialogs/AddChannel.vue"));

const sessionValidated = ref(false);
const leftDrawer = ref(false);
const rightDrawer = ref(false);
const router = useRouter();
const { host, guild, channel } = useChatRoute();

const channelData = computed(() => chatState.getChannel(host.value!, guild.value!, channel.value!));

onMounted(async() => {
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
	}
	catch (e) {
		router.push({ name: "serverselect" });
	}
});

watch(guild, () => {
	if (!guild.value || !host.value) return;
	const guildObject = chatState.getGuild(host.value, guild.value);
	guildObject.lastChannel && router.push({ params: { channel: guildObject.lastChannel } });
});
</script>

<template>
  <splash v-if="!sessionValidated" />
  <div v-else class="h-full w-full flex">
    <base-dialog v-model="uiState.state.addGuildDialog">
      <add-guild v-if="uiState.state.addGuildDialog" />
    </base-dialog>
    <base-dialog v-model="uiState.state.addChannelDialog">
      <add-channel v-if="uiState.state.addChannelDialog" />
    </base-dialog>
    <base-dialog v-model="uiState.state.userSettingsDialog" unsized>
      <user-settings v-if="uiState.state.userSettingsDialog" />
    </base-dialog>
    <base-drawer v-model="leftDrawer">
      <div class="flex h-full">
        <guild-list />
        <channel-list v-if="guild" />
      </div>
    </base-drawer>
    <div class="bg-surface-900 flex-1 flexcol overflow-hidden">
      <base-app-bar class="bg-surface-700 h-12 text-sm font-semibold">
        <base-button
          variant="text"
          icon
          dense
          class="!lg:hidden mr-2"
          aria-label="Left Drawer"
          @click="leftDrawer = true"
        >
          <mdi-menu />
        </base-button>
        <mdi-pound class="text-lg mr-2 text-gray-400" />
        {{ channelData.data?.name }}
        <div class="flex-1" />
        <base-button
          variant="text"
          icon
          dense
          class="!lg:hidden"
          aria-label="Right Drawer"
          @click="rightDrawer = true"
        >
          <mdi-account-multiple />
        </base-button>
      </base-app-bar>
      <template v-if="host && guild && channel">
        <messages :host="host" :guild="guild" :channel="channel" />
        <composer />
      </template>
      <div v-else class="flex-1 flexcol gap-4 justify-center items-center">
        <div class="bg-surface-800 rounded-full p-2">
          <mdi-pound class="text-5xl align-top text-gray-300" />
        </div>
        <div class="bg-surface-800 rounded-full p-2 px-4">
          <p v-if="guild">
            Select a channel to start chatting
          </p>
          <p v-else>
            Select a guild to get started
          </p>
        </div>
      </div>
    </div>
    <base-drawer v-model="rightDrawer" right>
      <div class="flex h-full">
        <member-list v-if="guild" />
      </div>
    </base-drawer>
  </div>
</template>
