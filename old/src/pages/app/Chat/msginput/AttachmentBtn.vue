<script lang="ts" setup>
import { useEventListener, useVModel } from "@vueuse/core";
import { defineProps, ref } from "vue";
import type { IAttachment } from "./types";
import HBtn from "~/components/shared/HBtn.vue";

const props = defineProps<{
  modelValue: IAttachment[];
}>();
const emit = defineEmits(["update:modelValue"]);
const files = useVModel(props, "modelValue", emit);
const fileUpload = ref<HTMLInputElement | undefined>(undefined);

const fileToAttachment = (f: File) => ({
  file: f,
  preview: URL.createObjectURL(f),
});

const addToQueue = (attachments: IAttachment[]) => {
  files.value = [...files.value, ...attachments];
};

useEventListener(document, "paste", (ev) => {
  const items = ev.clipboardData?.items;
  if (!items) return;
  const clipboard = Array.from(items);
  addToQueue(
    clipboard
      .map((v) => v.getAsFile())
      .filter((v): v is File => v !== null)
      .map(fileToAttachment)
  );
});

const selectFileComplete = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files) {
    addToQueue(Array.from(input.files).map(fileToAttachment));
  }
};

const onClick = () => fileUpload.value?.click();
</script>

<template>
  <h-btn class="ml-2" icon variant="text" @click="onClick">
    <mdi-image />
  </h-btn>
  <input
    ref="fileUpload"
    type="file"
    hidden
    multiple
    @change="selectFileComplete"
  />
</template>
