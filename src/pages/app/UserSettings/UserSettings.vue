<script lang="ts" setup>
import HDialog from "~/components/HDialog.vue";
import { dialogState } from "~/store/dialogs";
</script>

<template>
  <HDialog v-model="dialogState.state.userSettingsOpen">
    <div>
      <h1 v-t="'app.user-settings.title'" class="text-lg" />
    </div>
  </HDialog>
</template>
