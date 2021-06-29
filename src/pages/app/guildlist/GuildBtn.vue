<script lang="ts" setup>
import { ref } from "vue";
import GuildDialog from "./GuildDialog/GuildDialog.vue";
import HBtn from "~/components/HBtn.vue";

const dialogOpen = ref(false);
</script>

<template>
  <h-btn
    class="flex-shrink-0"
    style="aspect-ratio: 1"
    variant="outlined"
    color="primary"
    icon
    @click="dialogOpen = true"
  >
    <mdi-account-multiple-plus class="text-xl" />
  </h-btn>
  <guild-dialog v-model="dialogOpen" />
</template>
