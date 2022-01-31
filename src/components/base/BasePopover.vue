<template>
  <div ref="root">
    <slot />
    <div
      ref="popover"
      class="fixed popover z-1"
      :class="{ openOnHover, open, [placement || 'bottom']: !open || openOnHover }"
      v-bind="$attrs"
    >
      <div v-if="props.arrow" ref="arrowElement" class="arrow" />
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { arrow, computePosition, flip, offset, shift, size } from "@floating-ui/dom";
import type { ClientRectObject, Placement } from "@floating-ui/core";
import type { Ref } from "vue";
import { computed, onMounted, ref, watch } from "vue";
const props = defineProps<{
	open?: boolean
	openOnHover?: boolean
	arrow?: boolean
	placement?: Placement
	offset?: number
	matchWidth?: boolean
	customPosition?: {x: number; y: number}
}>();

const open = computed(() => props.open);
const root = ref() as Ref<HTMLElement>;
const popover = ref() as Ref<HTMLElement>;
const arrowElement = ref() as Ref<HTMLElement>;
const target = computed((): Element | {
	getBoundingClientRect: () => ClientRectObject
} => {
	if (props.customPosition) {
		const { x, y } = props.customPosition;
		return {
			getBoundingClientRect() {
				return {
					width: 0,
					height: 0,
					x,
					y,
					top: y,
					left: x,
					right: x,
					bottom: y,
				} as ClientRectObject;
			},
		};
	}
	return root.value.children[0];
});

const middleware = computed(() => {
	const enabled = [
		offset(8),
		flip(),
		shift(),
	];
	if (props.matchWidth) {
		enabled.push(size({
			apply({ reference }) {
				Object.assign(popover.value.style, {
					width: `${reference.width}px`,
				});
			},
		}));
	}
	if (props.arrow) enabled.push(arrow({ element: arrowElement.value }));
	return enabled;
});

async function updatePosition() {
	const { x, y, middlewareData, placement } = await computePosition(target.value, popover.value, {
		placement: props.placement,
		middleware: middleware.value,
	});

	Object.assign(popover.value.style, {
		left: `${x}px`,
		top: `${y}px`,
	});

	if (props.arrow) {
		const staticSide = {
			top: "bottom",
			right: "left",
			bottom: "top",
			left: "right",
		}[placement.split("-")[0]];
		const { x: arrowX, y: arrowY } = middlewareData.arrow!;
		Object.assign(arrowElement.value.style, {
			left: arrowX != null ? `${arrowX}px` : "",
			top: arrowY != null ? `${arrowY}px` : "",
			right: "",
			bottom: "",
			[staticSide!]: "-0.25em",
		});
	}
}

watch(open, () => updatePosition());

onMounted(async() => {
	updatePosition();
	if (!(target.value instanceof HTMLElement)) return;
	target.value.setAttribute("data-poptarget", "");
	if (props.openOnHover) {
		target.value.addEventListener("mouseenter", () => {
			updatePosition();
		});
	}
});

</script>

<style scoped lang="postcss">

.popover {
  @apply rounded-4px transform text-sm text-white capitalize transition-all duration-100 ease-in-out;

  &.openOnHover,
  &:not(.open) {
    @apply invisible opacity-0;
    &.bottom {
      @apply translate-y-2;
    }
    &.top {
      @apply -translate-y-2;
    }
    &.left {
      @apply -translate-x-2;
    }
    &.right {
      @apply translate-x-2;
    }
  }
}

[data-poptarget]:hover + .popover.openOnHover {
  @apply visible translate-x-0 translate-y-0 opacity-100;
}
</style>
