<script lang="ts" setup>
import MessageTypeButton from './MessageTypeButton.vue';


</script>

<template>
  <div class="bg-surface-1000 p-3 rounded-md flex flex-col gap-3">
    <p class="font-bold">Attachment Types</p>
    <hr class="border-surface-600" />
    <div class="grid grid-cols-3 gap-2 auto-cols-max w-max">
      <message-type-button class="bg-purple-600" label="Photos">
        <mdi:picture />
      </message-type-button>
      <message-type-button class="bg-emerald-600" label="Files">
        <mdi:file />
      </message-type-button>
      <message-type-button class="bg-blue-600" label="Location">
        <mdi:crosshairs-gps />
      </message-type-button>
      <message-type-button class="bg-blue-600" label="Woozy">
        <twemoji:woozy-face />
      </message-type-button>
    </div>
  </div>
</template>