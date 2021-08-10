<script lang="ts" setup>
import Details from "./Details.vue";
import HDialog from "~/components/HDialog.vue";
import { dialogState } from "~/store/dialogs";
</script>

<template>
  <HDialog v-model="dialogState.state.userSettingsOpen" compact>
    <div>
      <h1 v-t="'app.user-settings.title'" class="text-lg" />
    </div>
    <div>
      <Details />
    </div>
  </HDialog>
</template>
