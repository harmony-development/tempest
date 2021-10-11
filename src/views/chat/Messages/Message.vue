<script lang="ts" setup>
import { computed } from "vue";
import { chatState } from "../../../logic/store/chat";
import { useChatRoute } from "../../../router";
import TextMessage from "./TextMessage.vue";
import HImg from "~/components/shared/HImg.vue";
import HBtn from "~/components/shared/HBtn.vue";
import { session } from "../../../logic/store/session";
import Avatar from "~/components/chat/Avatar.vue";
const { host, guild, channel, message } = useChatRoute();
const { messageid, hideAvatar } = defineProps<{
  messageid: string;
  hideAvatar?: boolean;
}>();
const data = computed(() =>
  chatState.getMessage(host.value!, guild.value!, channel.value!, messageid)
);
const isOwnMessage = computed(
  () => data.value?.author === session.value?.userID
);
const content = computed(() => data.value.content?.content);
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
        p-3
        px-5
        rounded-2xl
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
