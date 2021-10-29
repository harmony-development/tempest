<script lang="ts" setup>
import MessageTypeButton from './MessageTypeButton.vue';
import { connectionManager } from '../../../logic/api/connections';
import { useChatRoute } from '~/router';
import { FormattedText } from '@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages';
import { useKeyModifier } from '@vueuse/core';

const { host, guild, channel } = useChatRoute();
const shiftState = useKeyModifier('Shift')
const emit = defineEmits(['sent']);

const onWoozy = async () => {
  await connectionManager.get(host.value!).chat.sendMessage({
    guildId: guild.value!,
    channelId: channel.value!,
    content: {
      content: {
        oneofKind: "textMessage",
        textMessage: {
          content: FormattedText.create({
            text: '🥴',
          }),
        },
      },
    },
  });
  if (!shiftState.value)
    emit('sent')
}
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
      <message-type-button class="bg-blue-600" label="Woozy" @click="onWoozy">
        <twemoji:woozy-face />
      </message-type-button>
    </div>
  </div>
</template>