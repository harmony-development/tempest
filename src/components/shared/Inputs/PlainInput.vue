<script lang="ts" setup>
import { useVModel } from "@vueuse/core";
import type { Ref } from "vue";
import { defineComponent, onMounted, ref, watch } from "vue";

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
const input = ref() as Ref<HTMLInputElement>;
const inputHeight = ref(0);

const resizeInput = () => {
	if (!input.value) return;
	input.value.style.height = "5px";
	inputHeight.value = Math.min(input.value.scrollHeight, 200);
};

if (props.multiline === true) watch(value, resizeInput);

onMounted(() => {
	if (props.focus) input.value.focus();
	if (props.multiline) resizeInput();
});

watch(
	() => props.focus,
	async () => {
		input.value.focus();
	}
);
</script>

<script lang="ts">
export default defineComponent({
	inheritAttrs: false,
});
</script>

<template>
	<textarea
		v-if="multiline"
		:id="props.name"
		ref="input"
		v-model="value"
		:type="props.type"
		:rows="props.rows"
		:required="props.required"
		class="input-input overflow-hidden"
		:placeholder="props.noBorder ? props.label : ''"
		:autocomplete="autocomplete"
		multiline
		:style="{ height: `${inputHeight}px` }"
		v-bind="$attrs"
		wrap="hard"
	/>
	<input
		v-else
		:id="props.name"
		ref="input"
		v-bind="$attrs"
		v-model="value"
		:type="props.type"
		:required="props.required"
		class="input-input"
		:class="{ dense }"
		:autocomplete="autocomplete"
		:placeholder="props.noBorder ? props.label : ' '"
	/>
</template>

<style lang="postcss" scoped>
.input-input {
	@apply max-h-200 bg-transparent z-1 w-full px-3 py-2 block appearance-none focus:outline-none resize-none break-words;
}
</style>
