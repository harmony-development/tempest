<script setup lang="ts">
import { onKeyStroke, useVModel } from "@vueuse/core";
import { defineEmits, defineProps } from "vue";
import PopInTransition from "~/components/transitions/PopInTransition.vue";
const props = defineProps<{
	modelValue?: boolean;
	unsized?: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);
const open = useVModel(props, "modelValue", emit);
onKeyStroke("Escape", () => (open.value = false));
</script>

<template>
	<Teleport to="#app">
		<pop-in-transition>
			<div
				v-if="open"
				class="bg-white flex h-full bg-opacity-5 w-full top-0 left-0 z-50 items-center align-center justify-center fixed"
				@mousedown="open = false"
			>
				<div
					class="shadow-xl p-4 bg-surface-900 rounded-sm"
					:class="{ sized: !unsized }"
					v-bind="$attrs"
					@mousedown.stop=""
				>
					<slot />
				</div>
			</div>
		</pop-in-transition>
	</Teleport>
</template>

<style lang="postcss" scoped>
.sized {
	@apply w-1/2 sm:w-80 lg:w-120;
}
</style>
