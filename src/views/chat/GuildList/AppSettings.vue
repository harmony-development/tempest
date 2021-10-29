<script lang="ts" setup>
import HPopover from '~/components/shared/HPopover.vue';
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

const open = ref(false)
const button = ref<HTMLElement | undefined>(undefined)
onClickOutside(button, () => {
  open.value = false
})
</script>

<template>
  <HBtn variant="outlined" color="primary" square aria-label="App Settings" @click="open = true">
    <h-tempest class="text-2xl" />
  </HBtn>
</template>
