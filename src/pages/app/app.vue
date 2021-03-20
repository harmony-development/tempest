<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import GuildList from "./guildlist/guildlist.vue";
import ChannelList from "./channellist/channellist.vue";
import Chat from "./chat/chat.vue";
import MemberList from "./memberlist/memberlist.vue";
import HBtn from "~/components/HBtn.vue";

import HDrawer from "~/components/HDrawer.vue";
import { session, host, isLoggedIn } from "~/logics/app";
import { getStream } from "~/logics/connections";

const router = useRouter();
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
      class="flex w-3/4 overflow-visible sm:w-1/2 md:w-80"
    >
      <guild-list />
      <channel-list />
    </h-drawer>
    <div class="flex flex-col flex-1">
      <div class="flex bg-harmonydark-800 p-2">
        <h-btn
          variant="text"
          icon
          class="lg:invisible"
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <mdi-menu />
        </h-btn>
        <div class="flex-1" />
        <h-btn
          variant="text"
          icon
          class="lg:invisible"
          @click="rightDrawerOpen = !rightDrawerOpen"
        >
          <ic-round-group />
        </h-btn>
      </div>
      <chat />
    </div>
    <div id="right-drawer-root" />
    <h-drawer
      v-if="mounted"
      v-model="rightDrawerOpen"
      class="flex w-3/4 overflow-visible sm:w-1/2 md:w-60"
      mount-point="#right-drawer-root"
      right
    >
      <div class="bg-harmonydark-800 w-full p-3">
        <member-list />
      </div>
    </h-drawer>
  </div>
</template>
