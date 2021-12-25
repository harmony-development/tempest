<script setup lang="ts">
const props = defineProps<{
	selected?: boolean
	dangerous?: boolean
	compact?: boolean
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
    }"
    tabindex="0"
  >
    <slot />
  </li>
</template>

<style lang="postcss" scoped>
.list-item {
	@apply w-full py-2 px-3 cursor-pointer select-none transition duration-100 whitespace-nowrap
         flex align-middle items-center border-4 border-transparent;
	&:hover {
		@apply bg-white bg-opacity-5;
	}
	&:active {
		@apply bg-white bg-opacity-10;
	}
	&:focus-visible {
		@apply ring-3 ring-primary-300 ring-inset;
	}
}
.compact {
	@apply py-1 px-2;
}
.selected {
	@apply  border-primary-500;
}

.dangerous {
	@apply text-red-500;
}
</style>
