<script setup lang="ts">
import { useRegisterSW } from "virtual:pwa-register/vue";
import HBtn from "../shared/HBtn.vue";

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

const close = async () => {
  offlineReady.value = false;
  needRefresh.value = false;
};
</script>

<template>
  <div v-if="offlineReady || needRefresh" class="pwa-toast" role="alert">
    <div class="message">
      <span v-if="offlineReady"> App ready to work offline </span>
      <span v-else>
        New content available, click on reload button to update.
      </span>
    </div>
    <h-btn variant="text" v-if="needRefresh" @click="updateServiceWorker()"
      >Reload</h-btn
    >
    <h-btn variant="text" @click="close">Close</h-btn>
  </div>
</template>

<style lang="postcss" scoped>
.pwa-toast {
  @apply bg-surface-900 fixed right-0 bottom-0 m-2 p-3 shadow-xl z-1 text-left;
}
.pwa-toast .message {
  @apply mb-2;
}
</style>
