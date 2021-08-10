<script setup lang="ts">
import { useRouter } from "vue-router";
import { onErrorCaptured, onMounted, ref } from "vue";
import GuildList from "./GuildList/GuildList.vue";
import ChannelList from "./ChannelList/channellist.vue";
import Chat from "./Chat/chat.vue";
import MemberList from "./MemberList/memberlist.vue";
import ChannelHeader from "./ChannelHeader/ChannelHeader.vue";
import GuildHeader from "./GuildHeader/GuildHeader.vue";
import ErrorDialog from "./ErrorDialog.vue";
import UserSettings from "./UserSettings/UserSettings.vue";
import HBtn from "~/components/shared/HBtn.vue";

import HDrawer from "~/components/HDrawer.vue";
import { session, host, isLoggedIn } from "~/logics/app";
import { getStream } from "~/logics/connections";
import { useAppRoute } from "~/logics/location";
import Alert from "~/components/Alert.vue";

const router = useRouter();
const route = useAppRoute();
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);
const mounted = ref(false);
const errorDialogOpen = ref(false);
const error = ref<Error | undefined>(undefined);

onMounted(() => (mounted.value = true));

if (!isLoggedIn()) {
  router.push("/entry/serverselect");
} else {
  (async () => {
    const stream = await getStream(host.value, session.value);
    stream.request.send({
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
      v-if="mounted"
      v-model="leftDrawerOpen"
      class="flex w-3/4 overflow-visible sm:w-1/2 md:w-70"
    >
      <guild-list />
      <div class="bg-light-400 dark:bg-harmonydark-800 flex-1">
        <guild-header v-if="route.guildid && route.host" />
        <channel-list v-if="route.guildid && route.host" />
      </div>
    </h-drawer>
    <div class="flex flex-col flex-1 min-w-0">
      <div class="flex bg-light-500 dark:bg-harmonydark-800 p-1 md:p-3">
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
      <div v-else class="flex flex-col flex-1 justify-center items-center">
        <ic-round-group
          class="rounded-full bg-gray-400 bg-opacity-30 mb-4 p-3 text-6xl"
        />
        <h1
          v-t="'app.no-guild-selected'"
          class="text-md text-blue-200 lg:text-xl"
        ></h1>
      </div>
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
