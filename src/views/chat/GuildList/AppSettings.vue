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
  <HPopover ref="button" placement="top" :open="open" :offset-x="12">
    <HBtn variant="outlined" color="primary" square aria-label="App Settings" @click="open = true">
      <h-tempest class="text-2xl" />
    </HBtn>
    <template #content>
      <div class="bg-primary-600 p-4 w-50">Hello</div>
    </template>
  </HPopover>
</template>
