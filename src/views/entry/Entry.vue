<script lang="ts" setup></script>

<template>
	<div class="background h-full w-full overflow-x-auto flexcol justify-center">
		<div class="flexcol gap-2 bg-surface-900 p-3 w-11/12 sm:m-12 md:w-150">
			<router-view />
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.background {
	background: repeating-linear-gradient(
		45deg,
		rgba(127, 127, 127, 0.05),
		rgba(127, 127, 127, 0.05) 10px,
		transparent 10px,
		transparent 20px
	);
	background-repeat: repeat;
	fill: black;
}
</style>
