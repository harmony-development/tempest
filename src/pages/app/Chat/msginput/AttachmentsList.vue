<script lang="ts" setup>
import { defineEmit, defineProps } from "vue";
import { useVModel } from "@vueuse/core";
import type { IAttachment } from "./types";
import HBtn from "~/components/shared/HBtn.vue";

const props = defineProps<{
  modelValue: IAttachment[];
}>();
const emit = defineEmits(["update:modelValue"]);
const attachments = useVModel(props, "modelValue", emit);

const removeAttachment = (idx: number) => {
  URL.revokeObjectURL(attachments.value[idx].preview);
  attachments.value.splice(idx, 1);
};
</script>

<template>
  <div
    class="
      flex flex-row
      dark:bg-harmonydark-600
      w-auto
      max-h-42
      p-2
      overflow-auto
    "
  >
    <div
      v-for="(img, i) in attachments"
      :key="img.preview"
      class="flex-shrink-0 h-32 mr-2 relative attachment-root"
    >
      <img
        v-if="img.file.type.startsWith('image/')"
        :src="img.preview"
        class="attachment"
      />
      <div
        v-else
        class="dark:bg-harmonydark-900 h-32 max-w-42 p-3 overflow-hidden"
      >
        <p class="whitespace-nowrap overflow-ellipsis overflow-hidden">
          <mdi-file class="mr-2 text-lg" />{{ img.file.name }}
        </p>
        <p class="text-sm bottom-2 left-2 text-gray-200 absolute">
          {{ img.file.size }} Bytes
        </p>
      </div>
      <div class="overlay">
        <h-btn icon variant="text" @click="removeAttachment(i)">
          <mdi-delete />
        </h-btn>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.attachment {
  @apply object-cover h-32;
}

.attachment-root:hover {
  & > .overlay {
    @apply visible opacity-100;
  }
}

.overlay {
  @apply bg-black flex h-full bg-opacity-40 w-full top-0 left-0 absolute justify-center items-center invisible opacity-0 transition-all duration-200;
}
</style>
