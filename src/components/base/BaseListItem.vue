<script setup lang="ts">
const props = defineProps<{
	selected?: boolean;
	dangerous?: boolean;
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
		}"
		tabindex="0"
	>
		<slot />
	</li>
</template>

<style lang="postcss" scoped>
.list-item {
	@apply w-full py-2 px-3 cursor-pointer select-none transition duration-100 whitespace-nowrap
         flex align-middle items-center;
	&:hover {
		@apply bg-white bg-opacity-10;
	}
	&:active {
		@apply bg-white bg-opacity-15;
	}
	&:focus-visible {
		@apply ring-3 ring-primary-300 ring-inset;
	}
}
.selected {
	@apply bg-white bg-opacity-5 bg-opacity-5;
}

.dangerous {
	@apply text-red-500;
}
</style>
