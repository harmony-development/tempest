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

const onJoinClicked = async () => {
	try {
		await api.joinGuild(session.value!.host, joinCode.value);
		close();
	} catch (e) {
		error.value = e;
	}
};

const onCreateClicked = async () => {
	try {
		await api.createGuild(session.value!.host, guildName.value);
		close();
	} catch (e) {
		error.value = e;
	}
};
</script>

<template>
	<form v-if="screen === 'join'" class="flexcol gap-2" @submit.prevent>
		<h1 class="text-xl">
			{{ $t("join-guild") }}
		</h1>
		<span class="text-red-400">{{ error?.code }}</span>
		<base-input v-model="joinCode" :label="$t('join-code')" />
		<a @click="screen = 'create'">{{ $t("create-guild") }}</a>
		<div class="flex justify-end gap-2">
			<base-button variant="text" type="button" @click="close">
				{{ $t("cancel") }}
			</base-button>
			<base-button variant="text" color="primary" type="submit" :disabled="!joinCode" @click="onJoinClicked">
				{{ $t("join") }}
			</base-button>
		</div>
	</form>
	<form v-else class="flexcol gap-2" @submit.prevent>
		<h1 class="text-xl">
			{{ $t("create-guild-0") }}
		</h1>
		<span class="text-red-400">{{ error?.code }}</span>
		<base-input v-model="guildName" :label="$t('guild-name')" />
		<a @click="screen = 'join'">{{ $t("join-guild-0") }}</a>
		<div class="flex justify-end gap-2">
			<base-button variant="text" type="button" @click="close">
				{{ $t("cancel") }}
			</base-button>
			<base-button variant="text" color="primary" type="submit" :disabled="!guildName" @click="onCreateClicked">
				{{ $t("create") }}
			</base-button>
		</div>
	</form>
</template>
