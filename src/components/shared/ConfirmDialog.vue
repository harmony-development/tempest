<script lang="ts" setup>
import { computed } from "vue";
import HDialog from "~/components/shared/HDialog.vue";
import { uiState } from "../../logic/store/ui";
import HBtn from "./HBtn.vue";

const dialog = computed(() => uiState.state.confirmDialog);
</script>

<template>
	<HDialog v-model="dialog.open">
		<h1 class="text-lg font-bold">{{ dialog.title }}</h1>
		<p class="mt-2 text-gray-300">{{ dialog.description }}</p>
		<div class="flex justify-end mt-2 gap-2">
			<HBtn color="secondary" variant="text" @click="() => uiState.rejectDialog()">Cancel</HBtn>
			<HBtn color="primary" variant="text" @click="() => uiState.resolveDialog()">OK</HBtn>
		</div>
	</HDialog>
</template>
