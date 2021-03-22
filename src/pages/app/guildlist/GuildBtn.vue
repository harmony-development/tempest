<script lang="ts" setup>
import { ref } from "vue";
import GuildDialog from "./GuildDialog/GuildDialog.vue";
import HBtn from "~/components/HBtn.vue";

const dialogOpen = ref(false);
</script>

<template>
  <h-btn
    variant="outlined"
    color="primary"
    icon
    class="h-14 w-14"
    @click="dialogOpen = true"
  >
    <mdi-account-multiple-plus />
  </h-btn>
  <guild-dialog v-model="dialogOpen" />
</template>
