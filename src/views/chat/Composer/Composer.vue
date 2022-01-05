<template>
  <div v-if="uploadQueue.length > 0" class="flex h-full overflow-hidden overflow-x-scroll bg-black h-38 w-full">
    <div class="flex gap-3 p-3">
      <div v-for="({ url, file }, i) in uploadQueue" :key="url" class="relative flex h-full group rounded-sm overflow-hidden square">
        <img v-if="file.type.startsWith('image/')" class="h-full object-cover " :src="url">
        <div v-else class="p-3 bg-primary-600 rounded-sm h-full flexcol w-full">
          <h1 class="font-bold overflow-ellipsis overflow-hidden text-sm">
            {{ file.name }}
          </h1>
          <div class="flex-1" />
          <p class="text-xs">
            {{ file.size }} Bytes
          </p>
        </div>
        <div
          class="
					absolute
					top-0
					left-0
					w-full
					h-full
					flex
					justify-center
					items-center
					bg-black bg-opacity-60
					transition
					duration-100
					opacity-0
					group-hover:opacity-100
				"
        >
          <base-button icon @click="deleteFile(i)">
            <mdi:delete />
          </base-button>
        </div>
      </div>
    </div>
  </div>
  <div class="flex items-center px-3 py-1 bg-surface-900">
    <base-popover :open="pickerOpen" placement="top-start" arrow offset-horizontally :offset="16">
      <base-button
        variant="text"
        icon
        class="picker-button"
        @click="pickerOpen = true"
      >
        <mdi-add :class="{ pickerOpen }" class="transition-all duration-100" />
      </base-button>
      <template #content>
        <message-type-picker
          ref="messageTypePicker"
          @sent="pickerOpen = false"
          @update:message-type="onMessageTypeChange"
        />
      </template>
    </base-popover>
    <base-input
      v-model="text"
      plain
      multiline
      no-border
      label="Write your message..."
      name="message-input"
      :rows="1"
      class="!bg-transparent w-full"
      @keydown="onKeyDown"
    />
    <base-button
      variant="text"
      :disabled="uploadQueue.length === 0 && isTextEmpty"
      icon
      class="picker-button"
      color="primary"
      @click="sendMessage"
    >
      <mdi-send :class="{ pickerOpen }" class="transition-all duration-100" />
    </base-button>
    <input ref="filePicker" type="file" class="hidden" multiple @change="onFilesSelected">
    <input
      ref="imagePicker"
      type="file"
      class="hidden"
      multiple
      accept="image/*"
      @change="onFilesSelected"
    >
  </div>
</template>

<script lang="ts" setup>
import { Attachment, FormattedText, Photo } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import { onClickOutside, useEventListener } from "@vueuse/core";
import type { Ref } from "vue";
import { computed, ref } from "vue";
import { useChatRoute } from "../../../router";
import { useAPI } from "../../../services/api";
import MessageTypePicker from "./MessageTypePicker.vue";
import BaseButton from "~/components/base/BaseButton.vue";
import BaseInput from "~/components/base/BaseInput.vue";
import PopInTransition from "~/components/transitions/PopInTransition.vue";
import BaseDropdown from "~/components/base/BaseMenu.vue";
import BasePopover from "~/components/base/BasePopover.vue";

const { host, guild, channel } = useChatRoute();
const api = useAPI();

const pickerOpen = ref(false);
const messageTypePicker = ref() as Ref<HTMLElement>;
const filePicker = ref() as Ref<HTMLInputElement>;
const imagePicker = ref() as Ref<HTMLInputElement>;
const text = ref("");
const uploadQueue = ref<
{
	url: string
	file: File
}[]
>([]);

const isTextEmpty = computed(() => text.value.replace(/\s/g, "").length === 0);

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

const onFilesSelected = (ev: Event) => {
	const files = (ev.target as HTMLInputElement).files!;
	uploadQueue.value.push(
		...Array.from(files).map(file => ({
			file,
			url: URL.createObjectURL(file),
		})),
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

const sendMessage = async() => {
	const content = text.value.replace(/\s\s+/g, " ");
	const files = uploadQueue.value.map(({ file }) => file);
	text.value = "";
	await api.sendMessage(host.value!, guild.value!, channel.value!, content, files);
	uploadQueue.value.forEach(({ url }) => URL.revokeObjectURL(url));
	uploadQueue.value = [];
};

const onKeyDown = async(ev: KeyboardEvent) => {
	if (ev.key !== "Enter" || ev.shiftKey) return;
	ev.preventDefault();
	sendMessage();
};
</script>

<style lang="postcss" scoped>
.pickerOpen {
	@apply transform rotate-45;
}
</style>
