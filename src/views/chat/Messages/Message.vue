<script lang="ts" setup>
import { computed, ref } from 'vue';
import { IMessageData } from "../../../logic/store/chat";
import HBtn from "~/components/shared/HBtn.vue";
import { session } from "../../../logic/store/session";
import Avatar from "~/components/chat/Avatar.vue";
import TextMessage from "./TextMessage.vue";
import EmbedMessage from "./EmbedMessage.vue";
import dayjs from 'dayjs';
import { onClickOutside } from '@vueuse/core';
import PopInTransition from '~/components/transitions/PopInTransition.vue';
import HListItem from '~/components/shared/Lists/HListItem.vue';
import { connectionManager } from '../../../logic/api/connections';
import { useChatRoute } from '../../../router';
import { uiState } from '../../../logic/store/ui';

const props = defineProps<{
  messageid: string;
  data: IMessageData;
  hideAvatar?: boolean;
}>();

const { host, guild, channel } = useChatRoute()
const optionsOpen = ref(false)
const optionsDropdown = ref<HTMLElement | undefined>(undefined)

onClickOutside(optionsDropdown, () => optionsOpen.value = false)

const isOwnMessage = computed(
  () => props.data?.author === session.value?.userID
);
const content = computed(() => props.data.content?.content);
const time = computed(() => {
  return dayjs(+props.data.createdAt * 1000).calendar()
});

const onDelete = async () => {
  await uiState.openConfirm("Are you sure?", "Are you sure you would like to delete this message?")
  await connectionManager.get(host.value!).chat.deleteMessage({
    messageId: props.messageid,
    guildId: guild.value!,
    channelId: channel.value!,
  })
}
</script>

<template>
  <div class="flex gap-2 items-center messageContainer" :class="{ ownMessage: isOwnMessage }">
    <Avatar :userid="data.author" class="h-8" :class="{ invisible: hideAvatar }" loading="lazy" />
    <div class="messageBody relative">
      <TextMessage
        v-if="content?.oneofKind === 'textMessage'"
        :content="content.textMessage.content"
      />
      <EmbedMessage v-if="content?.oneofKind === 'embedMessage'" :content="content.embedMessage" />
      <div class="w-full mt-2">
        <p class="time text-xs text-gray-400 float-right">{{ time }}</p>
      </div>
    </div>
    <div class="h-full mt-3 relative">
      <PopInTransition>
        <div class="options-dropdown overflow-hidden" v-if="optionsOpen" ref="optionsDropdown">
          <HListItem dangerous @click="onDelete">
            <mdi-delete class="mr-2" />
            <span>Delete Message</span>
          </HListItem>
        </div>
      </PopInTransition>
      <HBtn @click="optionsOpen = true" icon dense class="text-sm messageOptions">
        <mdi-dots-vertical />
      </HBtn>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.messageBody {
  @apply bg-surface-700 bg-opacity-60
        p-3
        pb-2
        rounded-md
        break-words
        whitespace-pre-wrap
        max-w-50ch
        transition
        duration-75 break-all;
  box-shadow: 0px 1px 1px #00000050;
}

.ownMessage {
  @apply flex-row-reverse;

  & .options-dropdown {
    @apply transform -translate-x-full -left-2;
  }
}

.options-dropdown {
  @apply bg-black rounded-md absolute left-[120%];
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