<script lang="ts" setup>
import { defineAsyncComponent, onMounted, ref } from "vue";
import { session } from "../../logic/store/session";
import { connectionManager } from "../../logic/api/connections";
import { useRouter } from "vue-router";
import Splash from "./Splash.vue";
import GuildList from "./GuildList/GuildList.vue";
import { pubsub } from "~/logic/api/pubsub";
import HAppBar from "~/components/shared/HAppBar.vue";
import HBtn from "~/components/shared/HBtn.vue";
import ChannelList from "./ChannelList/ChannelList.vue";
import HDrawer from "~/components/shared/HDrawer.vue";
import { uiState } from "../../logic/store/ui";
import HDialog from "~/components/shared/HDialog.vue";
import { useChatRoute } from "../../router";

const AddGuild = defineAsyncComponent(() => import("./Dialogs/AddGuild.vue"));

const sessionValidated = ref(false);
const leftDrawer = ref(false);
const rightDrawer = ref(false);
const router = useRouter();
const { guild } = useChatRoute();

onMounted(async () => {
  const [conn, stream] = connectionManager.create(
    session.value!.host,
    session.value!.session
  );
  try {
    await conn.auth.checkLoggedIn({});
    sessionValidated.value = true;
    const handler = pubsub(session.value!.host);
    stream.request.send({
      request: {
        oneofKind: "subscribeToHomeserverEvents",
        subscribeToHomeserverEvents: {},
      },
    });
    stream.response.onMessage(handler);
  } catch (e) {
    router.push({ name: "serverselect" });
  }
});
</script>

<template>
  <Splash v-if="!sessionValidated" />
  <div class="h-full w-full flex" v-else>
    <HDialog v-model="uiState.state.addGuildDialog">
      <AddGuild v-if="uiState.state.addGuildDialog" />
    </HDialog>
    <HDrawer v-model="leftDrawer">
      <div class="flex h-full">
        <GuildList />
        <ChannelList v-if="guild" />
      </div>
    </HDrawer>
    <div class="bg-surface-900 flex-1">
      <h-app-bar class="bg-surface-600">
        <h-btn
          variant="text"
          icon
          dense
          class="!lg:invisible"
          @click="leftDrawer = true"
          aria-label="Left Drawer"
        >
          <mdi-menu />
        </h-btn>
        Test
        <div class="flex-1" />
        <h-btn
          variant="text"
          icon
          dense
          class="!lg:invisible"
          @click="rightDrawer = true"
          aria-label="Right Drawer"
        >
          <mdi-menu />
        </h-btn>
      </h-app-bar>
    </div>
  </div>
</template>
