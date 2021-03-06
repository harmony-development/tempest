<script setup lang="ts">
import { useVModel } from "@vueuse/core";

import { defineProps, defineEmit, ref, watch } from "vue";

const emit = defineEmit(["update:modelValue"]);
const props = defineProps<{
  label?: string;
  name?: string;
  type?: string;
  modelValue?: string;
  focus?: boolean;
  multiline?: boolean;
  noBorder?: boolean;
}>();
const value = useVModel(props, "modelValue", emit);
const input = ref<HTMLInputElement | undefined>(undefined);

watch(
  () => props.focus,
  () => {
    if (!input.value) return;
    input.value.focus();
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
        class="input-input"
        placeholder=" "
        multiline
        :rows="2"
        wrap="hard"
      />
      <input
        v-else
        ref="input"
        v-model="value"
        :name="props.name"
        :type="props.type"
        class="input-input"
        placeholder=" "
      />
      <label :for="props.name" class="input-label">{{ props.label }}</label>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.input-parent {
  transition: 0.1s linear;
  @apply flex items-center outline border-2 relative rounded focus-within:border-blue-300;
}

.border {
  @apply dark:border-harmonydark-500;
}

.input-label {
  @apply text-md top-0 origin-0 p-3 pt-3 duration-300 absolute pointer-events-none dark:text-harmonydark-200;
}

.input-input {
  @apply bg-transparent text-md z-1 w-full p-3 block appearance-none focus:outline-none pl-3 resize-none break-words;
}

.input-parent:focus-within > .input-label,
.input-input:not(:placeholder-shown) + .input-label {
  @apply p-0 text-xs transform translate-y-0.5 translate-x-2;
}
</style>
