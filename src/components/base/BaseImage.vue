<script lang="ts">
defineComponent({
	inheritAttrs: false,
});
</script>

<script lang="ts" setup>
import { defineComponent, ref } from "vue";

defineProps<{
	fallback?: string;
	src?: string;
}>();

const loadFailure = ref(false);
</script>

<template>
	<div
		v-if="loadFailure || !src"
		class="flex justify-center h-full items-center select-none"
		:data-attempted="src"
		v-bind="$attrs"
	>
		<p>{{ fallback }}</p>
	</div>
	<img v-bind="$attrs" :src="src" @error="loadFailure = true" v-else />
</template>
