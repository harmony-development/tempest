<script setup lang="ts">
import { useVModel } from "@vueuse/core";

import { defineProps, ref, watch, onMounted } from "vue";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps<{
  label?: string;
  name?: string;
  type?: string;
  rows?: number;
  modelValue?: string;
  focus?: boolean;
  multiline?: boolean;
  noBorder?: boolean;
  dense?: boolean;
  required?: boolean;
  autocomplete?: string;
}>();

const value = useVModel(props, "modelValue", emit);
const input = ref<HTMLInputElement | undefined>(undefined);

const resizeInput = () => {
  if (!input.value) return;
  input.value.style.height = "5px";
  input.value.style.height = `${Math.min(input.value.scrollHeight, 200)}px`;
};

if (props.multiline === true) watch(value, resizeInput);

onMounted(() => {
  if (props.focus) input.value?.focus();
  if (props.multiline) resizeInput();
});

watch(
  () => props.focus,
  async () => {
    input.value?.focus();
  }
);
</script>
<template>
  <div class="flex items-center relative rounded transition duration-100 input-parent">
    <div>
      <slot name="pre-input" />
    </div>
    <textarea
      v-if="multiline"
      ref="input"
      v-model="value"
      :id="props.name"
      :type="props.type"
      :rows="props.rows"
      :required="props.required"
      class="input-input overflow-hidden"
      :placeholder="props.noBorder ? props.label : ''"
      :autocomplete="autocomplete"
      multiline
      wrap="hard"
    />
    <input
      v-else
      ref="input"
      v-model="value"
      :id="props.name"
      :type="props.type"
      :required="props.required"
      class="input-input"
      :class="{ dense }"
      :autocomplete="autocomplete"
      :placeholder="props.noBorder ? props.label : ' '"
    />
    <label :for="props.name" class="input-label">{{ props.label }}</label>
    <fieldset v-if="!noBorder" :for="props.name" class="label-wrapper">
      <legend class="label-text">{{ props.label }}</legend>
    </fieldset>
  </div>
</template>

<style lang="postcss" scoped>
.label-wrapper {
  @apply absolute -top-[0.6em] left-0 right-0 bottom-0 border-surface-500 border-1 transition duration-100 rounded-md px-1.5 overflow-hidden;
}

.input-label {
  @apply absolute top-1/2 left-4 transform -translate-y-1/2 pointer-events-none transition-all duration-100 text-gray-300;
}

.label-text {
  @apply text-sm invisible max-w-[0.01px] whitespace-nowrap;
}

.input-input {
  @apply max-h-200 bg-transparent z-1 w-full p-4 block appearance-none focus:outline-none resize-none break-words;
}

.dense {
  @apply p-1;
}

.input-parent:hover {
  & > .label-wrapper {
    @apply border-white;
  }
}

.input-parent:focus-within {
  & > .label-wrapper {
    @apply border-blue-300 text-blue-300;
  }

  & > .input-label {
    @apply text-blue-300;
  }
}

.input-parent:focus-within,
.input-input:not(:placeholder-shown) {
  & > .input-label,
  & + .input-label {
    @apply top-0.1em left-4 text-sm;
  }

  & * > .label-text,
  & ~ fieldset > .label-text {
    @apply max-w-full px-2;
  }
}
</style>
