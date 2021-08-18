<script lang="ts" setup>
import { defineEmit, defineProps, ref } from "vue";
import { useVModel } from "@vueuse/core";
import HInput from "~/components/HInput.vue";
import HBtn from "~/components/shared/HBtn.vue";
import { homeserverConn } from "~/logic/connections";
import { host } from "~/logic/app";

const props = defineProps<{
  open: boolean;
  screen: "join" | "create";
}>();
const emit = defineEmits(["update:open", "update:screen"]);

const open = useVModel(props, "open", emit);
const screen = useVModel(props, "screen", emit);
const name = ref("");

const createClicked = async () => {
  const homeConn = await homeserverConn();
  const guild = await homeConn.chat.createGuild({
    guildName: name.value,
    pictureUrl: "",
    metadata: undefined,
  });
  open.value = false;
};
</script>
<template>
  <h1 v-t="'app.guild-dialog.create-guild'" class="text-lg mb-2" />
  <h-input
    v-model="name"
    :label="$t('app.guild-dialog.create-input')"
    class="mb-2"
  />
  <h-link v-t="'app.guild-dialog.to-join'" @click="screen = 'join'" />
  <div class="flex justify-end">
    <h-btn
      v-t="'button.cancel'"
      variant="text"
      color="secondary"
      class="mr-1"
      @click="open = false"
    />
    <h-btn
      v-t="'app.guild-dialog.create'"
      variant="text"
      color="primary"
      @click="createClicked"
    />
  </div>
</template>
