<script setup lang="ts">
import ReloadPrompt from "./components/misc/ReloadPrompt.vue";
</script>

<template>
  <ReloadPrompt />
  <div class="h-100vh w-100vw bg-surface-800">
    <router-view />
  </div>
</template>
