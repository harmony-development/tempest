<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { Ref, ref } from "vue";

const open = ref(false);
const button = <Ref<HTMLElement>>ref();
onClickOutside(button, () => {
	open.value = false;
});
</script>

<template>
	<HBtn color="primary" square aria-label="App Settings" @click="open = true">
		<h-tempest class="text-2xl" />
	</HBtn>
</template>
