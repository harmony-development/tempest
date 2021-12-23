<script setup lang="ts">
import { useRegisterSW } from "virtual:pwa-register/vue";
import HBtn from '~/components/shared/HBtn.vue';

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

const close = async () => {
  offlineReady.value = false;
  needRefresh.value = false;
};
</script>

<template>
  <div class="pwa-toast" role="alert" v-if="needRefresh">
    <div class="message">
      <span>New content available, click on reload button to update.</span>
    </div>
    <HBtn color="primary" variant="text" @click="updateServiceWorker()" v-if="needRefresh">Reload</HBtn>
    <HBtn variant="text" @click="close">Close</HBtn>
  </div>
</template>

<style lang="postcss" scoped>
.pwa-toast {
  @apply bg-surface-900 fixed right-0 bottom-0 m-2 p-3 shadow-xl z-100 text-left;
}
.pwa-toast .message {
  @apply mb-2;
}
</style>
