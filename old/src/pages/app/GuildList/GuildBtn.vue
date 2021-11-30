<script lang="ts" setup>
import { ref } from "vue";
import HBtn from "~/components/shared/HBtn.vue";
import GuildDialog from "~/pages/app/Dialogs/GuildDialog/GuildDialog.vue";

const dialogOpen = ref(false);
</script>

<template>
  <h-btn
    square
    class="w-full"
    variant="outlined"
    color="primary"
    @click="dialogOpen = true"
  >
    <mdi-account-multiple-plus class="text-xl" />
  </h-btn>
  <guild-dialog v-model="dialogOpen" />
</template>
