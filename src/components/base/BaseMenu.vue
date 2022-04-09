<template>
	<base-popover class="text-xs" :open="open" v-bind="$attrs">
		<slot name="activator" :open="open" :activate="() => (open = true)" />
		<template #content>
			<ul class="bg-surface-600 p-1 text-xs rounded-4px overflow-hidden space-y-1">
				<base-list-item v-for="{ text, onClick, level } of options" :key="text" :dangerous="level === 'danger'" @click="() => onClick?.() && (open = false)">
					{{ text }}
				</base-list-item>
			</ul>
		</template>
	</base-popover>
	<div v-if="open" class="w-full h-full top-0 left-0 fixed" @click="open = false" />
</template>
<script setup lang="ts">
import { ref } from "vue";
import { onKeyStroke } from "@vueuse/core";
import BasePopover from "./BasePopover.vue";
import BaseListItem from "./BaseListItem.vue";

export interface IMenuOption {
	text: string;
	level?: "plain" | "danger";
	onClick?: () => void;
}

const open = ref(false);

onKeyStroke("Escape", () => (open.value = false));
defineProps<{
	options: IMenuOption[];
	stayOpen?: boolean;
}>();
</script>
