<script lang="ts" setup>
import { ref } from "vue";
import GuildDialog from "~/pages/app/Dialogs/GuildDialog/GuildDialog.vue";
import OutlinedBtn from "~/components/shared/OutlinedBtn.vue";

const dialogOpen = ref(false);
</script>

<template>
  <outlined-btn
    primary
    style="aspect-ratio: 1"
    class="p-4"
    @click="dialogOpen = true"
  >
    <mdi-account-multiple-plus class="text-xl" />
  </outlined-btn>
  <guild-dialog v-model="dialogOpen" />
</template>
