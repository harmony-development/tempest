<script lang="ts" setup>
const showDevHeader = import.meta.env.DEV;
</script>

<template>
  <div class="flex flex-col h-full">
    <dev-header v-if="showDevHeader" />
    <router-view />
  </div>
</template>

<style lang="postcss">
html,
body,
#app {
  @apply w-full h-full dark:text-white dark:bg-harmonydark-900;
  font-family: "Roboto";
}
</style>
