<script lang="ts" setup>
import { useVModel } from "@vueuse/core";
import { defineEmit, defineProps, ref } from "vue";
import type { IAttachment } from "./types";
import HBtn from "~/components/HBtn.vue";

const props = defineProps<{
  modelValue: IAttachment[];
}>();
const emit = defineEmit(["update:modelValue"]);
const files = useVModel(props, "modelValue", emit);
const fileUpload = ref<HTMLInputElement | undefined>(undefined);

const selectFileComplete = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files) {
    files.value = [
      ...files.value,
      ...Array.from(input.files).map((f) => ({
        file: f,
        preview: URL.createObjectURL(f),
      })),
    ];
  }
};
</script>

<template>
  <h-btn class="ml-2" icon variant="text" @click="fileUpload?.click()">
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
