<script lang="ts" setup>
import { ref } from "vue";
import HBtn from "~/components/shared/HBtn.vue";
import HDialog from "~/components/shared/HDialog.vue";
import HInput from "~/components/shared/HInput.vue";

defineEmits<{
  (event: "cancel"): void;
  (event: "done", name: string, host: string): void;
}>();

const name = ref("");
const host = ref("");
</script>

<template>
  <h-dialog v-bind="$attrs">
    <form class="flexcol gap-3" @submit.prevent>
      <h1 class="font-bold">Add Server</h1>

      <h-input v-model="name" label="Server Name" />
      <h-input v-model="host" label="Server Host" />

      <div class="flex justify-end gap-1">
        <h-btn type="button" variant="text" @click="$emit('cancel')">Cancel</h-btn>
        <h-btn
          type="submit"
          variant="text"
          color="primary"
          :disabled="!name || !host"
          @click="$emit('done', name, host)"
        >Done</h-btn>
      </div>
    </form>
  </h-dialog>
</template>
