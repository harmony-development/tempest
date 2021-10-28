<script lang="ts" setup>
import { computed } from "vue";
import { IMessageData } from "../../../logic/store/chat";
import HBtn from "~/components/shared/HBtn.vue";
import { session } from "../../../logic/store/session";
import Avatar from "~/components/chat/Avatar.vue";
import TextMessage from "./TextMessage.vue";
import EmbedMessage from "./EmbedMessage.vue";

const props = defineProps<{
  messageid: string;
  data: IMessageData;
  hideAvatar?: boolean;
}>();
const isOwnMessage = computed(
  () => props.data?.author === session.value?.userID
);
const content = computed(() => props.data.content?.content);
</script>

<template>
  <div
    class="flex gap-2 items-center messageContainer"
    :class="{ ownMessage: isOwnMessage }"
  >
    <Avatar
      :userid="data.author"
      class="h-8"
      :class="{ invisible: hideAvatar }"
      loading="lazy"
    />
    <div class="messageBody">
      <TextMessage
        v-if="content?.oneofKind === 'textMessage'"
        :content="content.textMessage.content"
      />
      <EmbedMessage
        v-if="content?.oneofKind === 'embedMessage'"
        :content="content.embedMessage"
      />
    </div>
    <div class="h-full mt-3">
      <HBtn icon dense class="text-sm messageOptions">
        <mdi-dots-vertical />
      </HBtn>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.messageBody {
  @apply bg-surface-700 bg-opacity-60
        border-1 border-surface-500
        p-3
        px-5
        rounded-xl
        break-words
        whitespace-pre-wrap
        max-w-50ch
        transition
        duration-75 break-all;
}

.ownMessage {
  @apply flex-row-reverse;
}

.messageContainer {
  & .messageOptions {
    @apply invisible;
  }

  &:hover {
    & .messageOptions {
      @apply visible;
    }

    & .messageBody {
      @apply bg-surface-700;
    }
  }
}
</style>
