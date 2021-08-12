<script lang="ts" setup>
import { useVModel } from "@vueuse/core";

const props = defineProps<{
  name: string;
  modelValue?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const model = useVModel(props, "modelValue", emit);
</script>

<template>
  <h-card dark class="w-full flex justify-between items-center">
    <div class="w-full flex flex-col gap-1">
      <p class="text-gray-300 text-sm">{{ name }}</p>
      <h-input v-model="model" dense />
    </div>
  </h-card>
</template>
