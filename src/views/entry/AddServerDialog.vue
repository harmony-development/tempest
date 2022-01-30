<script lang="ts" setup>
import { ref } from "vue";
import BaseButton from "~/components/base/BaseButton.vue";
import BaseDialog from "~/components/base/BaseDialog.vue";
import BaseInput from "~/components/base/BaseInput.vue";

defineEmits<{
	(event: "cancel"): void
	(event: "done", name: string, host: string): void
}>();

const name = ref("");
const host = ref("");
</script>

<template>
  <base-dialog v-bind="$attrs">
    <form class="flexcol gap-3" @submit.prevent>
      <h1 class="font-bold">
        {{ $t('add-server') }}
      </h1>

      <base-input v-model="name" :label="$t('server-name')" />
      <base-input v-model="host" :label="$t('server-host')" />

      <div class="flex justify-end gap-1">
        <base-button type="button" variant="text" @click="$emit('cancel')">
          {{ $t('cancel') }}
        </base-button>
        <base-button
          type="submit"
          variant="text"
          color="primary"
          :disabled="!name || !host"
          @click="$emit('done', name, host)"
        >
          {{ $t('done') }}
        </base-button>
      </div>
    </form>
  </base-dialog>
</template>
