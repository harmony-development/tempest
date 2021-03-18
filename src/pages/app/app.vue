<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import GuildList from "./guildlist/guildlist.vue";
import ChannelList from "./channellist/channellist.vue";
import HDrawer from "~/components/HDrawer.vue";
import { session, host, isLoggedIn } from "~/logics/app";
import { getChatStream } from "~/logics/connections";

const router = useRouter();
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);
const mounted = ref(false);

onMounted(() => (mounted.value = true));

if (!isLoggedIn()) {
  router.push("/entry/serverselect");
} else {
  const stream = await getChatStream(host.value, session.value);
  console.log(stream);
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
      <div class="flex-1 p-4 overflow-x-auto">
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
        <h1 class="text-2xl">Overflow</h1>
      </div>
      <div class="bg-harmonydark-700 p-3">Text Input</div>
    </div>
    <h-drawer v-model="rightDrawerOpen"> </h-drawer>
    <div class="bg-harmonydark-800 p-3">member list</div>
  </div>
</template>
