<script lang="ts" setup>
import { useVModel } from "@vueuse/core";
import HInput from "~/components/HInput.vue";

const props = defineProps<{
  name: string;
  modelValue?: string | boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const model = useVModel(props, "modelValue", emit);
</script>

<template>
  <h-card darkened class="w-full flex justify-between items-center">
    <div class="w-full flex flex-col gap-1">
      <p class="text-gray-300 text-sm">{{ name }}</p>
      <h-input
        v-if="typeof props.modelValue === 'string'"
        v-model="model"
        dense
      />
    </div>
  </h-card>
</template>
