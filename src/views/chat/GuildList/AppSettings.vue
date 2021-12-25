<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import type { Ref } from "vue";
import { ref } from "vue";
import BaseButton from "~/components/base/BaseButton.vue";

const open = ref(false);
const button = ref() as Ref<HTMLElement>;
onClickOutside(button, () => {
	open.value = false;
});
</script>

<template>
  <base-button color="primary" square aria-label="App Settings" @click="open = true">
    <h-tempest class="text-2xl" />
  </base-button>
</template>
