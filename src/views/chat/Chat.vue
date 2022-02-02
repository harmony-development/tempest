<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import type { MethodInfo, RpcError, RpcOptions } from "@protobuf-ts/runtime-rpc";
import { useI18n } from "vue-i18n";
import { chatState } from "../../logic/store/chat";
import { session } from "../../logic/store/session";
import { uiState } from "../../logic/store/ui";
import { useChatRoute } from "../../router";
import { useAPI } from "../../services/api";
import ChannelList from "./ChannelList/ChannelList.vue";
import UserSettings from "./Dialogs/UserSettings.vue";
import GuildList from "./GuildList/GuildList.vue";
import Splash from "./Splash.vue";
import MemberList from "./MemberList/MemberList.vue";
import Messages from "./Messages/Messages.vue";
import Composer from "./Composer/Composer.vue";
import GuildSettings from "./Dialogs/GuildSettings.vue";
import MemberItem from "./MemberList/MemberItem.vue";
import { pubsub } from "~/logic/api/pubsub";
import BaseDrawer from "~/components/base/BaseDrawer.vue";

const AddGuild = defineAsyncComponent(() => import("./Dialogs/AddGuild.vue"));
const AddChannel = defineAsyncComponent(() => import("./Dialogs/AddChannel.vue"));

const sessionValidated = ref(false);
const leftDrawer = ref(false);
const rightDrawer = ref(false);
const router = useRouter();

const { host: selectedHost, guild: selectedGuild, channel: selectedChannel } = useChatRoute();

const api = useAPI();
const toast = useToast();
const { t } = useI18n();
const ownUserID = computed(() => session.value?.userID);
const host = computed(() => session.value?.host);
session.value && api.setSession(session.value.host, session.value.session);

api.on("invalidSession", () => router.push({ name: "serverselect" }));
api.on("ratelimit", ({ error: _error, method, i, options }: {error: RpcError; method: MethodInfo<any, any>; i: object; options: RpcOptions}) => {
	toast.error(t("rate-limited-while-executing-method-name", [method.name]));
});

const channelData = computed(() => chatState.getChannel(selectedHost.value!, selectedGuild.value!, selectedChannel.value!));

const openUserSettings = () => uiState.state.userSettingsDialog = true;
const logOut = async() => {
	await router.push({
		name: "serverselect",
	});
	session.value = undefined;
};

onMounted(async() => {
	try {
		if (!session.value) throw new Error(t("no-session"));
		await api.checkLoggedIn(session.value.host, session.value.session);
		sessionValidated.value = true;
		const handler = pubsub("", api);
		api.getStream(session.value.host).responses.onMessage(handler);
		await api.fetchUser("", session.value.userID);
	}
	catch (e) {
		session.value = undefined;
		router.push({ name: "serverselect" });
	}
});

watch(selectedGuild, () => {
	if (!selectedGuild.value || !selectedHost.value) return;
	const guildObject = chatState.getGuild(selectedHost.value, selectedGuild.value);
	guildObject.lastChannel && router.push({ params: { channel: guildObject.lastChannel } });
});

watch([selectedHost, selectedGuild], ([host, guild], [prevHost, prevGuild]) => {
	if (host === prevHost && guild === prevGuild) return;
	if (host == null || !guild) return;
	Promise.all([
		api.fetchMemberList(host, guild),
		api.fetchChannelList(host, guild),
	]);
}, { immediate: true });
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
    <base-dialog v-model="uiState.state.guildSettingsDialog" unsized>
      <guild-settings v-if="uiState.state.guildSettingsDialog" :guild-id="selectedGuild!" :host="selectedHost!" />
    </base-dialog>
    <base-drawer v-model="leftDrawer">
      <div class="flex h-full">
        <guild-list />
        <channel-list v-if="selectedGuild" />
      </div>
    </base-drawer>
    <div class="bg-surface-1000 flex-1 flexcol overflow-hidden">
      <base-app-bar class="bg-surface-700 h-12 text-sm font-semibold">
        <base-button
          variant="text"
          icon
          dense
          class="!lg:hidden mr-2"
          :aria-label="$t('left-drawer')"
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
          :aria-label="$t('right-drawer')"
          @click="rightDrawer = true"
        >
          <mdi-account-multiple />
        </base-button>
      </base-app-bar>
      <template v-if="selectedHost !== undefined && selectedGuild && selectedChannel">
        <messages :host="selectedHost" :guild="selectedGuild" :channel="selectedChannel" />
        <composer :host="selectedHost" :guild="selectedGuild" :channel="selectedChannel" />
      </template>
      <div v-else class="flex-1 flexcol gap-4 justify-center items-center">
        <div class="bg-surface-800 rounded-full p-2">
          <mdi-pound class="text-5xl align-top text-gray-300" />
        </div>
        <div class="bg-surface-800 rounded-full p-2 px-4">
          <p v-if="selectedGuild">
            {{ $t('select-a-channel-to-start-chatting') }}
          </p>
          <p v-else>
            {{ $t('select-a-guild-to-get-started') }}
          </p>
        </div>
      </div>
    </div>
    <base-drawer v-model="rightDrawer" right>
      <div class="flex h-full">
        <div class="w-48 flexcol bg-surface-900 border-l-2 border-surface-800">
          <div class="h-12 flex items-center p-3">
            <h3 class="text-xs uppercase text-gray-400">
              {{ $t('members') }}
            </h3>
          </div>
          <div class="flex-1 h-full overflow-auto compact-scrollbar">
            <member-list v-if="selectedGuild" />
          </div>
          <base-menu v-if="ownUserID" placement="top" match-width :offset="0" :options="[{text: 'Settings', level: 'plain', onClick: openUserSettings}, {text: 'Log Out', level: 'plain', onClick: logOut}]">
            <template #activator="{activate}">
              <member-item :userid="ownUserID" :host="''" @click="activate" />
            </template>
          </base-menu>
        </div>
      </div>
    </base-drawer>
  </div>
</template>
