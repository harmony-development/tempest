<script lang="ts" setup>
import { computed } from "vue";
import { chatState } from "../../../logic/store/chat";
import { useChatRoute } from "../../../router";
import TextMessage from "./TextMessage.vue";
const { host, guild, channel, message } = useChatRoute();
const { messageid } = defineProps<{
  messageid: string;
}>();
const data = computed(() =>
  chatState.getMessage(host.value!, guild.value!, channel.value!, messageid)
);
const content = computed(() => data.value.content?.content);
</script>

<template>
  <div
    class="
      bg-surface-900
      p-3
      rounded-md
      break-words
      whitespace-pre-wrap
      max-w-50ch
      border-surface-700 border-1
      hover:border-primary-700
      transition
      duration-75
    "
  >
    <TextMessage
      v-if="content?.oneofKind === 'textMessage'"
      :content="content.textMessage.content"
    />
  </div>
</template>
