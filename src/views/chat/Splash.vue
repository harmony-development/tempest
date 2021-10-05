<script lang="ts" setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <div class="grid place-items-center h-full w-full">
    <div class="flex gap-2 flex-col items-center">
      <HSpinner class="text-6xl" />
      <p class="uppercase font-bold text-lg">connecting to server</p>
      <span class="text-gray-400">Issues connecting?</span>
      <a
        class="text-primary-300"
        @click="$router.push({ name: 'serverselect' })"
        >Return to main menu</a
      >
    </div>
  </div>
</template>
