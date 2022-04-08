<script setup lang="ts">
const props = defineProps<{
	variant?: "outlined" | "sided";
	selected?: boolean;
	dangerous?: boolean;
	compact?: boolean;
}>();
</script>

<template>
	<li
		ref="item"
		role="button"
		class="list-item"
		:class="{
			selected: props.selected,
			dangerous,
			compact,
			[variant || 'outlined']: true,
		}"
		tabindex="0"
	>
		<slot name="icon" />
		<slot />
	</li>
</template>

<style lang="postcss" scoped>
.list-item {
	@apply w-full py-2 px-3 cursor-pointer select-none transition duration-100 whitespace-nowrap
         flex align-middle items-center gap-2 rounded-md;
	&:hover {
		@apply bg-white bg-opacity-5;
	}
	&:active {
		@apply bg-white bg-opacity-10;
	}
	&:focus-visible {
		@apply ring-3 ring-primary-300;
	}
}
.compact {
	@apply py-1 px-2;
}
.outlined {
	@apply border-4 border-transparent;
}
.sided {
	@apply border-transparent border-l-4;
}
.selected {
	@apply bg-surface-500 outline outline-1 outline-primary-400 outline-offset-1;
}
.dangerous {
	@apply text-red-500;
}
</style>
