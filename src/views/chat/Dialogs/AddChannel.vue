<script lang="ts" setup>
import { ChannelKind } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/channels";
import { ref } from "vue";
import { useChatRoute } from "../../../router";
import BaseInput from "~/components/base/BaseInput.vue";
import { connectionManager } from "~/logic/api/connections";
import { uiState } from "~/logic/store/ui";
const { host, guild } = useChatRoute();
const channelName = ref("");
const error = ref();

const close = () => (uiState.state.addChannelDialog = false);

const onCreateClicked = async() => {
	try {
		await connectionManager.get(host.value!).chat.createChannel({
			guildId: guild.value!,
			channelName: channelName.value,
			kind: ChannelKind.TEXT_UNSPECIFIED,
		});
		close();
	}
	catch (e) {
		error.value = e;
	}
};
</script>
<template>
  <form class="flexcol gap-2" @submit.prevent>
    <h1 class="text-xl">
      Add Channel
    </h1>
    <span class="text-red-400">{{ error?.code || error }}</span>
    <base-input v-model="channelName" label="Channel Name" />
    <div class="flex justify-end gap-2">
      <base-button color="secondary" variant="text" type="button" @click="close">
        Cancel
      </base-button>
      <base-button
        variant="text"
        color="primary"
        type="submit"
        :disabled="!channelName"
        @click="onCreateClicked"
      >
        Create
      </base-button>
    </div>
  </form>
</template>
