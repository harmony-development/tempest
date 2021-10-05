<script lang="ts" setup>
import GuildIcon from "./GuildIcon.vue";
</script>

<template>
  <div
    class="bg-surface-900 w-18 p-2 h-full overflow-auto no-scrollbar grid gap-2"
  >
    <GuildIcon v-for="_ in 20" />
  </div>
</template>
