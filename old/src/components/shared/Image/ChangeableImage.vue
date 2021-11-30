import { selectFile } from '../../../logic/utils/fileSelect';
<script lang="ts" setup>
import { selectFile } from "~/logic/utils/fileSelect";
defineComponent({
  inheritAttrs: false,
});
const props = defineProps<{
  modelValue?: File;
  src: string;
}>();
const emit = defineEmits(["update:modelValue"]);
const newImage = useVModel(props, "modelValue", emit);
const preview = ref<string | undefined>(undefined);
const fileUpload = ref<HTMLInputElement | undefined>();

const onImageClick = async () => {
  preview.value && URL.revokeObjectURL(preview.value);
  const res = await selectFile(fileUpload.value!);
  if (!res) return;
  const selectedFile = res[0];
  if (!selectedFile) return;

  newImage.value = selectedFile;
};
</script>

<template>
  <div>
    <input ref="fileUpload" type="file" hidden />
    <h-image v-bind="$attrs" :src="preview || src" @click="onImageClick" />
  </div>
</template>
