<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import GuildList from "./guildlist/guildlist.vue";
import ChannelList from "./channellist/channellist.vue";
import Chat from "./chat/chat.vue";
import MemberList from "./memberlist/memberlist.vue";
import ChannelHeader from "./channelheader/ChannelHeader.vue"
import GuildHeader from "./guildheader/GuildHeader.vue"
import HBtn from "~/components/HBtn.vue";

import HDrawer from "~/components/HDrawer.vue";
import { session, host, isLoggedIn } from "~/logics/app";
import { getStream } from "~/logics/connections";
import { useAppRoute } from "~/logics/location";

const router = useRouter();
const route = useAppRoute();
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);
const mounted = ref(false);

onMounted(() => (mounted.value = true));

if (!isLoggedIn()) {
  router.push("/entry/serverselect");
} else {
  const stream = await getStream(host.value, session.value);
  stream.request.send({
    request: {
      oneofKind: "subscribeToHomeserverEvents",
      subscribeToHomeserverEvents: {},
    },
  });
}
</script>
<template>
  <div class="flex h-full w-full overflow-auto">
    <div id="drawer-root" />
    <h-drawer
      v-if="mounted"
      v-model="leftDrawerOpen"
      class="flex w-3/4 overflow-visible sm:w-1/2 md:w-70"
    >
      <guild-list />
      <div class="bg-harmonydark-800 flex-1">
        <guild-header v-if="route.guildid && route.host" />
        <channel-list v-if="route.guildid && route.host" />
      </div>
    </h-drawer>
    <div class="flex flex-col flex-1 min-w-0">
      <div class="flex bg-harmonydark-800 p-1">
        <h-btn
          variant="text"
          icon
          class="md:invisible"
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <mdi-menu />
        </h-btn>
        <div class="flex-1 flex items-center">
          <channel-header />
        </div>
        <h-btn
          variant="text"
          icon
          class="md:invisible"
          @click="rightDrawerOpen = !rightDrawerOpen"
        >
          <ic-round-group />
        </h-btn>
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
    <div id="right-drawer-root" />
    <h-drawer
      v-if="mounted"
      v-model="rightDrawerOpen"
      class="flex flex-col w-3/4 overflow-visible sm:w-1/2 md:w-60"
      mount-point="#right-drawer-root"
      right
    >
      <member-list />
    </h-drawer>
  </div>
</template>
