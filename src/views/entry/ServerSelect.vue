<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { session } from "../../logic/store/session";
import AddServerDialog from "./AddServerDialog.vue";
import { serverList } from "./serverlist";
import BaseButton from "~/components/base/BaseButton.vue";
import { parseUserHost } from "~/logic/parsing";
import BaseListItem from "~/components/base/BaseListItem.vue";

const router = useRouter();
const addingServer = ref(false);
const selectedServer = ref(0);

const deleteItem = (index: number) => {
	serverList.value.splice(index, 1);
};

const addServer = (name: string, host: string) => {
	serverList.value.unshift({ name, host });
	addingServer.value = false;
};

const nextClicked = async () => {
	const { host } = serverList.value[selectedServer.value];
	if (!host) return;
	await router.push({
		name: "auth",
		params: {
			host: parseUserHost(host),
		},
	});
};

onMounted(async () => {
	if (session.value) await router.push({ name: "chat" });
});
</script>

<template>
	<add-server-dialog v-model="addingServer" @cancel="addingServer = false" @done="addServer" />
	<h1 class="text-lg font-bold">
		{{ $t("welcome-to-tempest") }}
	</h1>
	<div class="text-sm w-full">
		<base-button variant="filled" color="primary" @click="addingServer = true">
			{{ $t("add-server") }}
		</base-button>
	</div>
	<ol class="bg-surface-800 rounded-sm overflow-hidden">
		<base-list-item
			v-for="({ name, host }, i) in serverList"
			:key="host"
			:selected="i === selectedServer"
			class="server-entry"
			@click="selectedServer = i"
			@keydown.enter="selectedServer = i"
		>
			<div class="text-sm">
				<p>{{ name }}</p>
				<p class="text-gray-400">
					{{ host }}
				</p>
			</div>
			<div class="flex-1" />
			<base-button icon variant="text" class="delete-button" @pointerdown.stop @click="deleteItem(i)">
				<mdi-delete />
			</base-button>
		</base-list-item>
	</ol>
	<base-button variant="filled" color="primary" class="w-min ml-auto" :disabled="!serverList[selectedServer]" @click="nextClicked">
		{{ $t("next") }}
	</base-button>
</template>

<style lang="postcss" scoped>
.server-entry {
	.delete-button {
		visibility: hidden;
	}
	&:hover,
	&:focus-within {
		.delete-button {
			visibility: visible;
		}
	}
}
</style>
