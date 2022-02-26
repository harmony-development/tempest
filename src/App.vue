<script setup lang="ts">
import ReloadPrompt from "~/components/misc/ReloadPrompt.vue";
import ConfirmDialog from "~/components/shared/ConfirmDialog.vue";
</script>

<template>
	<reload-prompt />
	<confirm-dialog />
	<div class="h-100vh w-100vw bg-surface-800">
		<router-view />
	</div>
</template>
