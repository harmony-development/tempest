<script lang="ts" setup>
import { computed } from "vue";
import { chatState } from "../../../logic/store/chat";
import { useChatRoute } from "../../../router";
import TextMessage from "./TextMessage.vue";
import HImg from "~/components/shared/HImg.vue";
import HBtn from "~/components/shared/HBtn.vue";
const { host, guild, channel, message } = useChatRoute();
const { messageid, hideAvatar } = defineProps<{
  messageid: string;
  hideAvatar?: boolean;
}>();
const data = computed(() =>
  chatState.getMessage(host.value!, guild.value!, channel.value!, messageid)
);
const content = computed(() => data.value.content?.content);
const avatar = computed(() => `${host.value}/_harmony/${data.value.author}`);
</script>

<template>
  <div class="flex gap-3 items-center messageContainer">
    <HImg
      :src="avatar"
      :fallback="avatar[0]"
      class="bg-primary-900 p-2 rounded-full square h-8"
      :class="{ invisible: hideAvatar }"
    />
    <div
      class="
        bg-surface-700 bg-opacity-60
        p-3
        px-5
        rounded-full
        break-words
        whitespace-pre-wrap
        max-w-50ch
        transition
        duration-75
      "
    >
      <TextMessage
        v-if="content?.oneofKind === 'textMessage'"
        :content="content.textMessage.content"
      />
    </div>
    <HBtn icon dense class="text-sm messageOptions">
      <mdi-dots-vertical />
    </HBtn>
  </div>
</template>

<style lang="postcss" scoped>
.messageContainer {
  & > .messageOptions {
    @apply invisible;
  }

  &:hover > .messageOptions {
    @apply visible;
  }
}
</style>
