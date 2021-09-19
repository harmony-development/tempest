<script setup lang="ts">
import { useVModel } from "@vueuse/core";

import { defineProps, ref, watch, nextTick, onMounted } from "vue";

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
}>();

const value = useVModel(props, "modelValue", emit);
const input = ref<HTMLInputElement | undefined>(undefined);

const resizeInput = () => {
  if (!input.value) return;
  input.value.style.height = "5px";
  input.value.style.height = `${Math.min(input.value.scrollHeight, 200)}px`;
};

onMounted(() => {
  if (props.focus) input.value?.focus();
});

watch(
  () => props.focus,
  async () => {
    input.value?.focus();
  }
);
</script>
<template>
  <div :class="{ 'input-parent': true, border: !props.noBorder }">
    <div>
      <slot name="pre-input" />
    </div>
    <div class="flex-1">
      <textarea
        v-if="multiline"
        ref="input"
        v-model="value"
        :name="props.name"
        :type="props.type"
        :rows="props.rows"
        :required="props.required"
        class="input-input overflow-hidden"
        placeholder=" "
        multiline
        wrap="hard"
        @input="resizeInput"
      />
      <input
        v-else
        ref="input"
        v-model="value"
        :name="props.name"
        :type="props.type"
        :required="props.required"
        class="input-input"
        :class="{ dense }"
        placeholder=" "
      />
      <label :for="props.name" class="input-label">{{ props.label }}</label>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.input-parent {
  transition: 0.1s linear;
  @apply dark:bg-harmonydark-900 flex items-center border-2 relative rounded dark:border-harmonydark-500 focus-within:border-blue-300;
}

.input-label {
  @apply top-0 p-3 pt-3 duration-300 absolute pointer-events-none dark:text-harmonydark-200;
}

.input-input {
  @apply max-h-200 bg-transparent z-1 w-full p-3 block appearance-none focus:outline-none pl-3 resize-none break-words;
}

.dense {
  @apply p-1;
}

.input-parent:focus-within > .input-label,
.input-input:not(:placeholder-shown) + .input-label {
  @apply p-0 text-xs transform translate-y-0.5 translate-x-2;
}
</style>
