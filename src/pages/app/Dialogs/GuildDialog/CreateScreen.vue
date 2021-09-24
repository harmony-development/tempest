<script lang="ts" setup>
import { defineProps, ref } from "vue";
import { useVModel } from "@vueuse/core";
import HInput from "~/components/HInput.vue";
import HBtn from "~/components/shared/HBtn.vue";
import { homeserverConn } from "~/logic/connections";

const props = defineProps<{
  open: boolean;
  screen: "join" | "create";
}>();
const emit = defineEmits(["update:open", "update:screen"]);

const openModel = useVModel(props, "open", emit);
const screenModel = useVModel(props, "screen", emit);
const name = ref("");

const createClicked = async () => {
  const homeConn = await homeserverConn();
  await homeConn.chat.createGuild({
    name: name.value,
    picture: "",
    metadata: undefined,
  });
  openModel.value = false;
};
</script>
<template>
  <h1 v-t="'app.guild-dialog.create-guild'" class="text-lg mb-2" />
  <h-input
    v-model="name"
    :label="$t('app.guild-dialog.create-input')"
    class="mb-2"
  />
  <h-link v-t="'app.guild-dialog.to-join'" @click="screenModel = 'join'" />
  <div class="flex justify-end">
    <h-btn
      v-t="'button.cancel'"
      variant="text"
      color="secondary"
      class="mr-1"
      @click="openModel = false"
    />
    <h-btn
      v-t="'app.guild-dialog.create'"
      variant="text"
      color="primary"
      @click="createClicked"
    />
  </div>
</template>
