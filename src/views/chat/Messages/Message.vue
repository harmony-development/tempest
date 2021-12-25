<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import dayjs from "dayjs";
import type { Ref } from "vue";
import { computed, ref } from "vue";
import { connectionManager } from "../../../logic/api/connections";
import type { IMessageData } from "../../../logic/store/chat";
import { chatState } from "../../../logic/store/chat";
import { session } from "../../../logic/store/session";
import { uiState } from "../../../logic/store/ui";
import AttachmentMessage from "./AttachmentMessage.vue";
import EmbedMessage from "./EmbedMessage.vue";
import PhotosMessage from "./PhotosMessage.vue";
import TextMessage from "./TextMessage.vue";
import PopInTransition from "~/components/transitions/PopInTransition.vue";
import Avatar from "~/components/chat/Avatar.vue";
import BaseListItem from "~/components/base/BaseListItem.vue";
import BaseButton from "~/components/base/BaseButton.vue";

const props = defineProps<{
	host: string
	guildid: string
	channelid: string
	messageid: string
	data: IMessageData
	hideAvatar: boolean
}>();

const optionsOpen = ref(false);
const optionsDropdown = ref() as Ref<HTMLElement>;

const authorData = computed(() => (props.host ? chatState.getUser(props.host, props.data.author) : undefined));

const username = computed(() => props.data.override?.username || authorData.value?.username || "Unknown User");

onClickOutside(optionsDropdown, () => (optionsOpen.value = false));

const isOwnMessage = computed(() => props.data?.author === session.value?.userID);
const content = computed(() => props.data.content?.content);
const time = computed(() => {
	return dayjs(+props.data.createdAt * 1000).calendar();
});
const onDelete = async() => {
	await uiState.openConfirm("Are you sure?", "Are you sure you would like to delete this message?");
	await connectionManager.get(props.host!).chat.deleteMessage({
		messageId: props.messageid,
		guildId: props.guildid!,
		channelId: props.channelid!,
	});
};
</script>

<template>
  <div class="flex gap-2 items-start messageContainer" :class="{ ownMessage: isOwnMessage }">
    <div v-if="!hideAvatar" class="text-center overflow-hidden w-16">
      <avatar :userid="data.author" :override="data.override?.avatar" class="h-8" loading="lazy" />
      <p class="mt-2 text-xs text-surface-300 overflow-hidden">
        {{ username }}
      </p>
    </div>
    <div :class="hideAvatar && 'hideAvatar'" class="messageBody text-sm relative">
      <text-message v-if="content?.oneofKind === 'textMessage'" :content="content.textMessage.content" />
      <attachment-message
        v-else-if="content?.oneofKind === 'attachmentMessage'"
        :content="content.attachmentMessage.files"
      />
      <photos-message v-else-if="content?.oneofKind === 'photoMessage'" :content="content.photoMessage.photos" />
      <embed-message v-else-if="content?.oneofKind === 'embedMessage'" :content="content.embedMessage" />
      <div v-else>
        <mdi:alert class="text-4xl" />
        <p>Unimplemented message type</p>
      </div>
      <div class="w-full mt-2">
        <p class="time text-xs text-gray-400 float-right">
          {{ time }}
        </p>
      </div>
    </div>
    <div class="h-full relative">
      <pop-in-transition>
        <div v-if="optionsOpen" ref="optionsDropdown" class="options-dropdown overflow-hidden">
          <base-list-item dangerous @click="onDelete">
            <mdi-delete class="mr-2" />
            <span>Delete Message</span>
          </base-list-item>
        </div>
      </pop-in-transition>
      <base-button icon dense class="text-md messageOptions" @click="optionsOpen = true">
        <mdi-dots-vertical />
      </base-button>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.messageBody {
	@apply bg-surface-800 bg-opacity-60
        p-3
        pb-2
        rounded-sm
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
	@apply bg-black rounded-sm absolute left-[120%];
}

.messageContainer {
	& .messageOptions {
		@apply invisible;
	}

  &:not(.ownMessage) .messageBody.hideAvatar {
    @apply ml-18;
  }

  & .messageBody.hideAvatar {
    @apply mr-18;
  }

	&:hover {
		& .messageOptions {
			@apply visible;
		}

		& .messageBody {
			@apply bg-surface-800;
		}
	}
}
</style>
