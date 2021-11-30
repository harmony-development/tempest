<script lang="ts" setup>
import HDialog from "~/components/HDialog.vue";
import { dialogState } from "~/store/dialogs";
</script>

<template>
  <HDialog v-model="dialogState.state.guildSettingsOpen">
    <div>
      <h1 v-t="'app.guild-settings.title'" class="text-lg" />
    </div>
  </HDialog>
</template>
