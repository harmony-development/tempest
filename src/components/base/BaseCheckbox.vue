<template>
	<div class="flex items-center gap-2 select-none">
		<input v-model="checked" class="check opacity-0 absolute h-8 w-8" :class="{ active: checked }" type="checkbox" />
		<div class="border-primary-500 border-2 text-transparent rounded-md w-8 h-8 flex flex-shrink-0 justify-center items-center">
			<mdi-check />
		</div>
		<label>
			{{ name }}
		</label>
	</div>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";

const emits = defineEmits(["update:modelValue"]);
const props = defineProps<{
	name: string;
	modelValue?: boolean;
}>();
const checked = useVModel(props, "modelValue", emits);
</script>

<style scoped lang="postcss">
.check.active + div {
	@apply bg-primary-500 text-white border-3;
}
</style>
