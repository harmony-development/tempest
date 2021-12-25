<script lang="ts" setup>
import { createPopper, Instance, PositioningStrategy } from "@popperjs/core";
import { Placement } from "@popperjs/core/lib/enums";
import { defineComponent, onMounted, Ref, ref, watch } from "vue";
defineComponent({
	inheritAttrs: false,
});
const props = defineProps<{
	placement?: Placement;
	strategy?: PositioningStrategy;
	openOnHover?: boolean;
	open?: boolean;
	offsetX?: number;
	offsetY?: number;
}>();
const target = <Ref<HTMLElement>>ref();
const content = <Ref<HTMLElement>>ref();
const instance = <Ref<Instance>>ref();
onMounted(() => {
	instance.value = createPopper(target.value!, content.value!, {
		strategy: props.strategy || "fixed",
		placement: props.placement || "auto",
		modifiers: [
			{
				name: "offset",
				options: {
					offset: [props.offsetX ?? 0, props.offsetY ?? 8],
				},
			},
		],
	});
});
watch(props, () => instance.value?.update());
</script>

<template>
	<div ref="target" v-bind="$attrs" class="target">
		<slot />
	</div>
	<div ref="content" class="content" :class="{ open, openOnHover }">
		<div class="inner-box">
			<slot name="content" />
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.content {
	@apply invisible;
	& > .inner-box {
		@apply transition duration-300 transform -translate-x-1;
	}
}

.open {
	@apply visible translate-x-0;
	& > .inner-box {
		@apply translate-x-0;
	}
}

.target:hover {
	& + .openOnHover {
		@apply visible;
		& > .inner-box {
			@apply translate-x-0;
		}
	}
}
</style>
