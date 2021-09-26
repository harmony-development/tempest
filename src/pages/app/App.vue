<script setup lang="ts">
import { useRouter } from "vue-router";
import { onErrorCaptured, onMounted, ref } from "vue";
import GuildList from "./GuildList/GuildList.vue";
import ChannelList from "./ChannelList/ChannelList.vue";
import Chat from "./Chat/chat.vue";
import MemberList from "./MemberList/MemberList.vue";
import ChannelHeader from "./ChannelHeader/ChannelHeader.vue";
import GuildHeader from "./GuildHeader/GuildHeader.vue";
import ErrorDialog from "./ErrorDialog.vue";
import UserSettings from "./Dialogs/UserSettings/UserSettings.vue";
import HBtn from "~/components/shared/HBtn.vue";

import HDrawer from "~/components/HDrawer.vue";
import { session, host, isLoggedIn } from "~/logic/app";
import { getStream } from "~/logic/connections";
import { useAppRoute } from "~/logic/location";
import Alert from "~/components/Alert.vue";

const router = useRouter();
const route = useAppRoute();
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);
const errorDialogOpen = ref(false);
const error = ref<Error | undefined>(undefined);

if (!isLoggedIn()) {
  router.push("/entry/serverselect");
} else {
  (async () => {
    const stream = await getStream(host.value, session.value);
    stream?.request.send({
      request: {
        oneofKind: "subscribeToHomeserverEvents",
        subscribeToHomeserverEvents: {},
      },
    });
  })();
}

onErrorCaptured((err) => {
  error.value = err;
  errorDialogOpen.value = true;
});
</script>
<template>
  <user-settings />
  <alert v-model="errorDialogOpen">
    <error-dialog :err="error" />
  </alert>
  <div class="flex h-full w-full overflow-auto">
    <h-drawer
      v-model="leftDrawerOpen"
      class="flex w-3/4 overflow-visible sm:w-1/2 md:w-70"
    >
      <guild-list />
      <div v-if="route.host && route.guildid" class="bg-surface-800 flex-1">
        <guild-header />
        <channel-list />
      </div>
    </h-drawer>
    <div v-if="!route.guildid" class="grid place-content-center w-full">
      <div class="flex flex-col items-center">
        <ic-round-group class="rounded-full bg-surface-700 mb-4 p-3 text-6xl" />
        <span
          v-t="'app.no-guild-selected'"
          class="bg-surface-700 p-2 px-4 rounded-full"
        />
      </div>
    </div>
    <div class="flex flex-col flex-1 min-w-0">
      <div class="flex bg-surface-800 p-1 md:p-3">
        <div class="md:hidden">
          <h-btn variant="text" icon @click="leftDrawerOpen = !leftDrawerOpen">
            <mdi-menu />
          </h-btn>
        </div>
        <div class="flex flex-1 items-center">
          <channel-header />
        </div>
        <div class="md:hidden">
          <h-btn
            variant="text"
            icon
            class="md:hidden"
            @click="rightDrawerOpen = !rightDrawerOpen"
          >
            <ic-round-group />
          </h-btn>
        </div>
      </div>
      <chat v-if="route.guildid && route.host" />
    </div>
    <div id="right-drawer-root">
      <h-drawer
        v-model="rightDrawerOpen"
        class="flex flex-col w-3/4 overflow-visible sm:w-1/2 md:w-60"
        right
      >
        <member-list />
      </h-drawer>
    </div>
  </div>
</template>
