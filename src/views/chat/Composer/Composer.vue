<template>
  <div class="bg-black p-3 flex gap-3 h-38" v-if="uploadQueue.length > 0">
    <div
      v-for="({ url, file }, i) in uploadQueue"
      :key="url"
      class="relative group rounded-sm overflow-hidden"
    >
      <img class="h-full" :src="url" v-if="file.type.startsWith('image/')" />
      <div class="p-3 bg-primary-600 rounded-sm h-full flexcol" v-else>
        <h1 class="font-bold">{{ file.name }}</h1>
        <div class="flex-1" />
        <p class="text-xs">{{ file.size }} Bytes</p>
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
        <HBtn icon @click="deleteFile(i)">
          <mdi:delete />
        </HBtn>
      </div>
    </div>
  </div>
  <div class="flex items-center p-1 bg-surface-900">
    <div class="relative">
      <PopInTransition>
        <MessageTypePicker
          class="absolute bottom-[120%] picker"
          v-if="pickerOpen"
          ref="messageTypePicker"
          @sent="pickerOpen = false"
          @update:message-type="onMessageTypeChange"
        />
      </PopInTransition>
      <HBtn
        variant="text"
        icon
        class="picker-button"
        @click="pickerOpen = true"
      >
        <mdi-add :class="{ pickerOpen }" class="transition-all duration-100" />
      </HBtn>
    </div>
    <HInput
      plain
      multiline
      no-border
      label="Write your message..."
      name="message-input"
      :rows="1"
      class="!bg-transparent w-full"
      v-model="text"
      @keydown="onKeyDown"
    />
    <input
      type="file"
      ref="filePicker"
      class="hidden"
      multiple
      @change="onFilesSelected"
    />
    <input
      type="file"
      ref="imagePicker"
      class="hidden"
      multiple
      accept="image/*"
      @change="onFilesSelected"
    />
  </div>
</template>

<style lang="postcss" scoped>
.pickerOpen {
  @apply transform rotate-45;
}
</style>

<script lang="ts" setup>
import {
  Attachment,
  FormattedText,
  Photo,
} from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import { onClickOutside, useEventListener } from "@vueuse/core";
import { Ref, ref } from "vue";
import HBtn from "~/components/shared/HBtn.vue";
import HInput from "~/components/shared/HInput.vue";
import PopInTransition from "~/components/transitions/PopInTransition.vue";
import { connectionManager } from "../../../logic/api/connections";
import { useChatRoute } from "../../../router";
import MessageTypePicker from "./MessageTypePicker.vue";

const { host, guild, channel } = useChatRoute();

const pickerOpen = ref(false);
const messageTypePicker = <Ref<HTMLElement>>ref();
const filePicker = <Ref<HTMLInputElement>>ref();
const imagePicker = <Ref<HTMLInputElement>>ref();
const text = ref("");
const uploadQueue = ref<
  {
    url: string;
    file: File;
  }[]
>([]);

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

const onKeyDown = async (ev: KeyboardEvent) => {
  if (ev.key !== "Enter" || ev.shiftKey) return;
  ev.preventDefault();
  const content = text.value;
  const files = uploadQueue.value.map(({ file }) => file);
  text.value = "";
  const conn = connectionManager.get(host.value!);
  if (files.length > 0) {
    const allFilesArePhotos = files.every((file) =>
      file.type.startsWith("image/")
    );
    uploadQueue.value.forEach(({ url }) => URL.revokeObjectURL(url));
    uploadQueue.value = [];
    const uploaded = await Promise.all(
      files.map(async (f) => conn.uploadFile(f))
    );
    if (allFilesArePhotos) {
      await conn.chat.sendMessage({
        guildId: guild.value!,
        channelId: channel.value!,
        content: {
          content: {
            oneofKind: "photoMessage",
            photoMessage: {
              photos: uploaded.map((f) =>
                Photo.create({
                  hmc: f.id,
                })
              ),
            },
          },
        },
      });
    } else {
      await conn.chat.sendMessage({
        guildId: guild.value!,
        channelId: channel.value!,
        content: {
          content: {
            oneofKind: "attachmentMessage",
            attachmentMessage: {
              files: uploaded.map((f) =>
                Attachment.create({
                  id: f.id,
                })
              ),
            },
          },
        },
      });
    }
  }
  return conn.chat.sendMessage({
    guildId: guild.value!,
    channelId: channel.value!,
    content: {
      content: {
        oneofKind: "textMessage",
        textMessage: {
          content: FormattedText.create({
            text: content,
          }),
        },
      },
    },
  });
};
</script>
