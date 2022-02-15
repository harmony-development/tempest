<script setup lang="ts">
import PlainInput from "./PlainInput.vue";

const props = defineProps<{
	label?: string
	placeholder?: string
	name?: string
	noBorder?: boolean
}>();
</script>
<template>
  <div class="flex items-center relative rounded transition duration-100 input-parent">
    <div>
      <slot name="pre-input" />
    </div>
    <plain-input v-bind="$attrs" />
    <label :for="props.name" class="input-label">{{ props.placeholder || props.label }}</label>
    <fieldset v-if="!noBorder" :for="props.name" class="label-wrapper">
      <legend class="label-text">
        {{ props.placeholder || props.label }}
      </legend>
    </fieldset>
    <mdi:help-circle-outline />
  </div>
</template>

<style lang="postcss" scoped>
.label-wrapper {
	@apply absolute -top-[0.6em] left-0 right-0 bottom-0 border-surface-500 border-1 transition duration-100 rounded-sm px-1.5 overflow-hidden;
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
