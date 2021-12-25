<template>
  <input type="file" ref="imageInput" class="hidden" multiple accept="image/*" @change="onChange" />
  <HImg
    v-bind="$attrs"
    class="w-32 h-32 bg-surface-500 text-5xl rounded-full cursor-pointer"
    @click="imageInput.click()"
    :src="modelValue ? previewImageURL : undefined"
  />
</template>

<script setup lang="ts">
import { onUnmounted, Ref, ref } from 'vue';
import HImg from '../shared/HImg.vue';

const props = defineProps<{
  modelValue?: File,
  previewSrc?: string;
}>();
const emit = defineEmits(["update:modelValue"]);
const imageInput = <Ref<HTMLInputElement>>ref();
const previewImageURL = ref<string>(props.previewSrc || "")

onUnmounted(() => URL.revokeObjectURL(previewImageURL.value!))

const onChange = (event: Event) => {
  const file = (<HTMLInputElement>event.target).files![0]
  if (!file) return;
  previewImageURL.value = URL.createObjectURL(file)
  emit("update:modelValue", file)
}
</script>
