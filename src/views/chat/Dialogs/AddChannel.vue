<script lang="ts" setup>
import { ChannelKind } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/channels";
import { ref } from "vue";
import { useChatRoute } from "../../../router";
import BaseInput from "~/components/base/BaseInput.vue";
import { uiState } from "~/logic/store/ui";
import { useAPI } from "~/services/api";

const { host, guild } = useChatRoute();
const api = useAPI();

const channelName = ref("");
const error = ref();

const close = () => (uiState.state.addChannelDialog = false);

const onCreateClicked = async() => {
	try {
		api.createChannel(host.value!, guild.value!, channelName.value, ChannelKind.TEXT_UNSPECIFIED);
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
      {{ $t('add-channel') }}
    </h1>
    <span class="text-red-400">{{ error?.code || error }}</span>
    <base-input v-model="channelName" :label="$t('channel-name')" />
    <div class="flex justify-end gap-2">
      <base-button color="secondary" variant="text" type="button" @click="close">
        {{ $t('cancel') }}
      </base-button>
      <base-button
        variant="text"
        color="primary"
        type="submit"
        :disabled="!channelName"
        @click="onCreateClicked"
      >
        {{ $t('create') }}
      </base-button>
    </div>
  </form>
</template>
