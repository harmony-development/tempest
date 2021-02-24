<template>
  <div class="font-sans w-full h-full">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import "./assets/roboto.css";

export default defineComponent({
  name: "App",
});
</script>

<style lang="postcss">
.dark {
  @apply text-white bg-harmonydark-900;
}

.light {
  @apply text-white bg-gray-100;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
