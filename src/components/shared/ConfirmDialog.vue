<script lang="ts" setup>
import { computed } from "vue";
import { uiState } from "../../logic/store/ui";
import BaseButton from "../base/BaseButton.vue";
import BaseDialog from "../base/BaseDialog.vue";
const dialog = computed(() => uiState.state.confirmDialog);
</script>

<template>
  <base-dialog v-model="dialog.open">
    <h1 class="text-lg font-bold">
      {{ dialog.title }}
    </h1>
    <p class="mt-2 text-gray-300">
      {{ dialog.description }}
    </p>
    <div class="flex justify-end mt-2 gap-2">
      <base-button color="secondary" variant="text" @click="() => uiState.rejectDialog()">
        Cancel
      </base-button>
      <base-button color="primary" variant="text" @click="() => uiState.resolveDialog()">
        OK
      </base-button>
    </div>
  </base-dialog>
</template>
