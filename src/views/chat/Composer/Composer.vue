<template>
	<div v-if="uploadQueue.length > 0" class="flex h-full overflow-hidden overflow-x-scroll bg-black h-38 w-full">
		<div class="flex gap-3 p-3">
			<div v-for="({ url, file }, i) in uploadQueue" :key="url" class="relative flex h-full group rounded-sm overflow-hidden square">
				<img v-if="file.type.startsWith('image/')" class="h-full object-cover" :src="url" />
				<div v-else class="p-3 bg-primary-600 rounded-sm h-full flexcol w-full">
					<h1 class="font-bold overflow-ellipsis overflow-hidden text-sm">
						{{ file.name }}
					</h1>
					<div class="flex-1" />
					<p class="text-xs">
						{{ $t("file-size-bytes", [file.size]) }}
					</p>
				</div>
				<div
					class="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-60 transition duration-100 opacity-0 group-hover:opacity-100"
				>
					<base-button icon @click="deleteFile(i)">
						<mdi:delete />
					</base-button>
				</div>
			</div>
		</div>
	</div>
	<div class="mx-3 bg-surface-800 rounded-xl">
		<div v-show="replyTo" class="bg-surface-900 flex justify-center items-center rounded-t-xl relative py-1 px-2 overflow-hidden">
			<span class="w-full mr-auto">
				{{ $t("replying-to") }} <strong>{{ replyTo?.username }}</strong>
			</span>
			<button class="absolute bg-surface-800 hover:bg-surface-600 h-full right-0 top-0 square flex items-center justify-center" @click="clearReply">
				<mdi:close />
			</button>
		</div>
		<div class="flex items-center">
			<base-popover :open="pickerOpen" placement="top-start" arrow offset-horizontally :offset="16">
				<button variant="text" icon class="picker-button pl-3 py-4 hover:text-gray-400" @click="pickerOpen = true">
					<mdi-add :class="{ pickerOpen }" class="transition-all duration-100" />
				</button>
				<template #content>
					<MessageTypePicker ref="messageTypePicker" @sent="pickerOpen = false" @update:message-type="onMessageTypeChange" />
				</template>
			</base-popover>
			<base-input
				v-model="text"
				plain
				multiline
				no-border
				:label="$t('write-your-message')"
				name="message-input"
				:rows="1"
				class="!bg-transparent w-full"
				@keydown="onKeyDown"
			/>
			<base-button variant="text" :disabled="uploadQueue.length === 0 && isTextEmpty" icon class="picker-button" color="primary" @click="sendMessage">
				<mdi-send :class="{ pickerOpen }" class="transition-all duration-100" />
			</base-button>
			<input ref="filePicker" type="file" class="hidden" multiple @change="onFilesSelected" />
			<input ref="imagePicker" type="file" class="hidden" multiple accept="image/*" @change="onFilesSelected" />
		</div>
	</div>
	<span class="my-auto mx-3 text-sm border-white" :class="{ invisible: typerNames.length === 0 }">
		<mdi:dots-horizontal class="inline animate-pulse text-xl mb-0.5" />
		<strong>{{ t("chat.typing.users", typerNames, typerNames.length) }}</strong>
		{{ t("chat.typing.suffix", typerNames.length) }}
	</span>
</template>

<script lang="ts" setup>
import { onClickOutside, useEventListener } from "@vueuse/core";
import type { Ref } from "vue";
import { computed, ref, toRefs } from "vue";
import { useI18n } from "vue-i18n";
import BaseButton from "~/components/base/BaseButton.vue";
import BaseInput from "~/components/base/BaseInput.vue";
import BasePopover from "~/components/base/BasePopover.vue";
import { chatState } from "~/logic/store/chat";
import { session } from "../../../logic/store/session";
import { useAPI } from "../../../services/api";
import MessageTypePicker from "./MessageTypePicker.vue";

const props = defineProps<{
	host: string;
	guild: string;
	channel: string;
}>();

const { host, guild, channel } = toRefs(props);
const api = useAPI();
const { t } = useI18n();

const pickerOpen = ref(false);
const messageTypePicker = ref() as Ref<HTMLElement>;
const filePicker = ref() as Ref<HTMLInputElement>;
const imagePicker = ref() as Ref<HTMLInputElement>;
const text = ref("");
const uploadQueue = ref<
	{
		url: string;
		file: File;
	}[]
>([]);

const typers = computed(() => chatState.getTypers(host.value, guild.value, channel.value).filter((userID) => userID !== session.value?.userID));
const typerNames = computed(() => typers.value.map((user) => chatState.getUser(host.value, user)?.username));
const isTextEmpty = computed(() => text.value.replace(/\s/g, "").length === 0);
const replyTo = computed(() => {
	const replyTo = chatState.ensureChannel(host.value, guild.value, channel.value)?.replyTo;
	if (!replyTo) return;
	const message = chatState.getMessage(host.value, guild.value, channel.value, replyTo);
	if (!message) return;
	return {
		replyTo,
		username: chatState.getUser(host.value, message.author)?.username,
	};
});

onClickOutside(messageTypePicker, () => (pickerOpen.value = false));

useEventListener("paste" as any, (ev: ClipboardEvent) => {
	const items = ev.clipboardData?.items;
	if (!items) return;
	for (const item of Array.from(items)) {
		const file = item.getAsFile();
		if (!file) continue;
		uploadQueue.value.push({
			url: URL.createObjectURL(file),
			file,
		});
	}
});

const clearReply = () => chatState.clearReply(host.value, guild.value, channel.value);

const onFilesSelected = (ev: Event) => {
	const files = (ev.target as HTMLInputElement).files!;
	uploadQueue.value.push(
		...Array.from(files).map((file) => ({
			file,
			url: URL.createObjectURL(file),
		}))
	);
};

const deleteFile = (i: number) => {
	URL.revokeObjectURL(uploadQueue.value[i].url);
	uploadQueue.value.splice(i, 1);
};

const onMessageTypeChange = (value: string) => {
	switch (value) {
		case "file":
			filePicker.value.click();
			break;
		case "image":
			imagePicker.value.click();
			break;
	}
	pickerOpen.value = false;
};

const sendMessage = async () => {
	const content = text.value.replace(/\s\s+/g, " ");
	const files = uploadQueue.value.map(({ file }) => file);
	text.value = "";
	await api.sendMessage(host.value, guild.value, channel.value, content, files, replyTo.value?.replyTo);
	uploadQueue.value.forEach(({ url }) => URL.revokeObjectURL(url));
	uploadQueue.value = [];
	chatState.clearReply(host.value, guild.value, channel.value);
};

let lastTyping = 0;
const onKeyDown = async (ev: KeyboardEvent) => {
	if (Date.now() - lastTyping > 2000) {
		lastTyping = Date.now();
		void api.sendTyping(host.value, guild.value, channel.value);
	}
	if (ev.key !== "Enter" || ev.shiftKey) return;
	ev.preventDefault();
	await sendMessage();
};
</script>

<style lang="postcss" scoped>
.pickerOpen {
	@apply transform rotate-45;
}
</style>
