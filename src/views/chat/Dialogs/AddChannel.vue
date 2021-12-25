<script lang="ts" setup>
import { ChannelKind } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/channels";
import { ref } from "vue";
import HInput from "~/components/shared/HInput.vue";
import { connectionManager } from "~/logic/api/connections";
import { uiState } from "~/logic/store/ui";
import { useChatRoute } from "../../../router";

const { host, guild } = useChatRoute();
const channelName = ref("");
const error = ref();

const close = () => (uiState.state.addChannelDialog = false);

const onCreateClicked = async () => {
  try {
    await connectionManager.get(host.value!).chat.createChannel({
      guildId: guild.value!,
      channelName: channelName.value,
      kind: ChannelKind.TEXT_UNSPECIFIED,
    });
    close();
  } catch (e) {
    error.value = e;
  }
};
</script>
<template>
  <form class="flexcol gap-2" @submit.prevent>
    <h1 class="text-xl">Add Channel</h1>
    <span class="text-red-400">{{ error?.code || error }}</span>
    <HInput label="Channel Name" v-model="channelName" />
    <div class="flex justify-end gap-2">
      <HBtn color="secondary" variant="text" type="button" @click="close">Cancel</HBtn>
      <HBtn
        variant="text"
        color="primary"
        type="submit"
        @click="onCreateClicked"
        :disabled="!channelName"
      >Create</HBtn>
    </div>
  </form>
</template>
