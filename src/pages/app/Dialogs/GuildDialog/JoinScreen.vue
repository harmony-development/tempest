<script lang="ts" setup>
import { defineEmit, defineProps, ref } from "vue";
import { useVModel } from "@vueuse/core";
import HInput from "~/components/HInput.vue";
import HBtn from "~/components/shared/HBtn.vue";
import { parseHarmonyURI } from "~/logic/utils/parsing";
import { useAppRoute } from "~/logic/location";
import { getOrFederate, homeserverConn } from "~/logic/connections";

const props = defineProps<{
  open: boolean;
  screen: "join" | "create";
}>();
const emit = defineEmits(["update:open", "update:screen"]);
const route = useAppRoute();
const openModel = useVModel(props, "open", emit);
const screenModel = useVModel(props, "screen", emit);
const inputCode = ref("");

const joinClicked = async () => {
  const { host, code } = parseHarmonyURI(inputCode.value, route.value.host);
  const conn = await getOrFederate(host);
  await conn.chat.joinGuild({
    inviteId: code,
  });
  openModel.value = false;
};
</script>
<template>
  <h1 v-t="'app.guild-dialog.join-guild'" class="text-lg mb-2" />
  <h-input
    v-model="inputCode"
    :label="$t('app.guild-dialog.join-input')"
    class="mb-2"
  />
  <a v-t="'app.guild-dialog.to-create'" @click="screenModel = 'create'" />
  <div class="flex justify-end">
    <h-btn
      v-t="'button.cancel'"
      variant="text"
      color="secondary"
      class="mr-1"
      @click="openModel = false"
    />
    <h-btn
      v-t="'app.guild-dialog.join'"
      variant="text"
      color="primary"
      @click="joinClicked"
    />
  </div>
</template>
