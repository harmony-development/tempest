<script lang="ts" setup>
import type { Embed } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";

defineProps<{
	embed: Embed;
}>();

function toColor(num: number) {
	return `#${num.toString(16).padStart(6, "0")}`;
}
</script>

<template>
	<div class="border-l-3 rounded-sm p-3 bg-surface-800" :style="{ borderColor: toColor(embed.color!) }">
		<h1 class="font-bold">
			{{ embed.title }}
		</h1>
		<p class="mt-2 text-xs text-gray-300">
			{{ embed.body }}
		</p>
	</div>
</template>
