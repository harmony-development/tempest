<script lang="ts" setup>
import MessageTypeButton from './MessageTypeButton.vue';


const emit = defineEmits(['update:messageType'])

const updateType = (type: string) => emit('update:messageType', type);
</script>

<template>
  <div class="bg-surface-1000 p-3 rounded-md flexcol gap-3">
    <p class="font-bold">Attachment Types</p>
    <hr class="border-surface-600" />
    <div class="grid grid-cols-3 gap-2 auto-cols-max w-max">
      <MessageTypeButton class="bg-purple-600" label="Photos" @click="updateType('image')">
        <mdi:picture />
      </MessageTypeButton>
      <MessageTypeButton class="bg-emerald-600" label="Files" @click="updateType('file')">
        <mdi:file />
      </MessageTypeButton>
      <MessageTypeButton class="bg-blue-600" label="Location" @click="updateType('location')">
        <mdi:crosshairs-gps />
      </MessageTypeButton>
      <MessageTypeButton class="bg-blue-600" label="Woozy" @click="updateType('woozy')">
        <twemoji:woozy-face />
      </MessageTypeButton>
    </div>
  </div>
</template>