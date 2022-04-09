<template>
	<base-popover arrow class="tooltip" open-on-hover>
		<slot />
		<template #content>
			{{ text || "_" }}
		</template>
	</base-popover>
</template>

<script setup lang="ts">
import BasePopover from "./BasePopover.vue";
defineProps<{
	text?: string;
}>();
</script>

<style lang="postcss">
.tooltip.popover {
	@apply p-2 bg-primary-500 shadow-xl;
}

.tooltip .arrow {
	@apply absolute w-2 h-2 rotate-45 transform bg-primary-500;
}
</style>
