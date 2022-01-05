<script lang="ts" setup>
import { ref } from "vue";
import { session } from "../../../logic/store/session";
import { uiState } from "../../../logic/store/ui";
import { useAPI } from "../../../services/api";
import BaseInput from "~/components/base/BaseInput.vue";
import BaseButton from "~/components/base/BaseButton.vue";

const screen = ref<"join" | "create">("join");
const joinCode = ref("");
const guildName = ref("");
const error = ref<any>(undefined);
const api = useAPI();

const close = () => (uiState.state.addGuildDialog = false);

const onJoinClicked = async() => {
	try {
		await api.joinGuild(session.value!.host, joinCode.value);
		close();
	}
	catch (e) {
		error.value = e;
	}
};

const onCreateClicked = async() => {
	try {
		await api.createGuild(session.value!.host, guildName.value);
		close();
	}
	catch (e) {
		error.value = e;
	}
};
</script>

<template>
  <form v-if="screen === 'join'" class="flexcol gap-2" @submit.prevent>
    <h1 class="text-xl">
      Join Guild
    </h1>
    <span class="text-red-400">{{ error?.code }}</span>
    <base-input v-model="joinCode" label="Join Code" />
    <a @click="screen = 'create'">Create guild?</a>
    <div class="flex justify-end gap-2">
      <base-button variant="text" type="button" @click="close">
        Cancel
      </base-button>
      <base-button
        variant="text"
        color="primary"
        type="submit"
        :disabled="!joinCode"
        @click="onJoinClicked"
      >
        Join
      </base-button>
    </div>
  </form>
  <form v-else class="flexcol gap-2" @submit.prevent>
    <h1 class="text-xl">
      Create Guild
    </h1>
    <span class="text-red-400">{{ error?.code }}</span>
    <base-input v-model="guildName" label="Guild Name" />
    <a @click="screen = 'join'">Join guild?</a>
    <div class="flex justify-end gap-2">
      <base-button variant="text" type="button" @click="close">
        Cancel
      </base-button>
      <base-button
        variant="text"
        color="primary"
        type="submit"
        :disabled="!guildName"
        @click="onCreateClicked"
      >
        Create
      </base-button>
    </div>
  </form>
</template>
