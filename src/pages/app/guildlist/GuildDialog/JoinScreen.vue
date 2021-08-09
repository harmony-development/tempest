<script lang="ts" setup>
import { defineEmit, defineProps, ref } from "vue";
import { useVModel } from "@vueuse/core";
import HInput from "~/components/HInput.vue";
import HBtn from "~/components/shared/HBtn.vue";
import { parseHarmonyURI } from "~/logics/harmonyAPI";
import { useAppRoute } from "~/logics/location";
import { getOrFederate, homeserverConn } from "~/logics/connections";

const props = defineProps<{
  open: boolean;
  screen: "join" | "create";
}>();
const emit = defineEmit(["update:open", "update:screen"]);
const route = useAppRoute();
const open = useVModel(props, "open", emit);
const screen = useVModel(props, "screen", emit);
const inputCode = ref("");

const joinClicked = async () => {
  const { host, code } = parseHarmonyURI(inputCode.value, route.value.host);
  const conn = await getOrFederate(host);
  const homeConn = await homeserverConn();
  const guild = await conn.chat.joinGuild({
    inviteId: code,
  });
  await homeConn.chat.addGuildToGuildList({
    guildId: guild.response.guildId,
    homeserver: host,
  });
  open.value = false;
};
</script>
<template>
  <h1 v-t="'app.guild-dialog.join-guild'" class="text-lg mb-2" />
  <h-input
    v-model="inputCode"
    :label="$t('app.guild-dialog.join-input')"
    class="mb-2"
  />
  <a
    v-t="'app.guild-dialog.to-create'"
    class="text-sm text-blue-200 cursor-pointer ml-2 underline"
    @click="screen = 'create'"
  />
  <div class="flex justify-end">
    <h-btn
      v-t="'button.cancel'"
      variant="text"
      color="secondary"
      class="mr-1"
      @click="open = false"
    />
    <h-btn
      v-t="'app.guild-dialog.join'"
      variant="text"
      color="primary"
      @click="joinClicked"
    />
  </div>
</template>
