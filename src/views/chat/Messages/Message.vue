<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import dayjs from "dayjs";
import type { Ref } from "vue";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getMessageText } from "../../../logic/conversions/messages";
import type { IMessageData } from "../../../logic/store/chat";
import { chatState } from "../../../logic/store/chat";
import { session } from "../../../logic/store/session";
import { uiState } from "../../../logic/store/ui";
import { useAPI } from "../../../services/api";
import Attachment from "./Attachment.vue";
import BaseEmbed from "./BaseEmbed.vue";
import Avatar from "~/components/chat/Avatar.vue";
import BasePopover from "~/components/base/BasePopover.vue";
import BaseListItem from "~/components/base/BaseListItem.vue";
import BaseButton from "~/components/base/BaseButton.vue";

const props = defineProps<{
	host: string;
	guildid: string;
	channelid: string;
	messageid: string;
	data: IMessageData;
	hideAvatar: boolean;
}>();

const api = useAPI();
const { t } = useI18n();

const optionsOpen = ref(false);
const optionsDropdown = ref() as Ref<HTMLElement>;

const authorData = computed(() => chatState.getUser(props.host, props.data.author));
const username = computed(() => props.data.override?.username || authorData.value?.username || t("unknown-user"));

const replyMessage = computed(() =>
	props.data.inReplyTo ? chatState.getMessage(props.host, props.guildid, props.channelid, props.data.inReplyTo) : undefined
);

onClickOutside(optionsDropdown, () => (optionsOpen.value = false));

const isOwnMessage = computed(() => props.data?.author === session.value?.userID);
const content = computed(() => props.data.content);
const attachments = computed(() => content.value?.attachments);
const embeds = computed(() => content.value?.embeds);
const time = computed(() => {
	return dayjs(+props.data.createdAt).calendar();
});
const onDelete = async () => {
	await uiState.openConfirm(t("are-you-sure"), t("are-you-sure-you-would-like-to-delete-this-message"));
	return api.deleteMessage(props.host, props.messageid, props.guildid!, props.channelid!);
};
const onReply = () => {
	chatState.setReplyTo(props.host, props.guildid, props.channelid, props.messageid);
	optionsOpen.value = false;
};
</script>

<template>
	<div class="flex gap-2 items-start messageContainer" :class="{ ownMessage: isOwnMessage }">
		<div v-if="!hideAvatar" class="text-center overflow-hidden w-16 flex-shrink-0">
			<avatar :userid="data.author" :override="data.override?.avatar" class="h-7 w-7" loading="lazy" />
			<p class="mt-2 text-xs text-surface-300 overflow-hidden">
				{{ username }}
			</p>
		</div>
		<div :class="hideAvatar && 'hideAvatar'" class="messageBody text-sm relative">
			<text v-if="content" :content="content" />
			<template v-if="attachments">
				<attachment v-for="attachment in attachments" :key="attachment.id" :host="host" :attachment="attachment" />
			</template>
			<template v-if="embeds">
				<base-embed v-for="embed in embeds" :key="embed.title" :embed="embed" />
			</template>
			<div v-else>
				<mdi:alert class="text-4xl" />
				<p>{{ $t("missing-content") }}</p>
			</div>
			<div class="w-full mt-2">
				<p class="time text-xs text-gray-400 float-right">
					{{ time }}
				</p>
			</div>
		</div>
		<base-popover :open="optionsOpen" placement="right-start">
			<base-button icon dense class="text-md messageOptions" @click="optionsOpen = true">
				<mdi-dots-vertical />
			</base-button>
			<template #content>
				<div ref="optionsDropdown" class="bg-surface-600 rounded-lg overflow-hidden">
					<base-list-item compact plain @click="onReply">
						<mdi-reply class="mr-2" />
						<span>{{ $t("reply") }}</span>
					</base-list-item>
					<base-list-item compact dangerous @click="onDelete">
						<mdi-delete class="mr-2" />
						<span>{{ $t("delete-message") }}</span>
					</base-list-item>
				</div>
			</template>
		</base-popover>
		<div
			v-if="replyMessage"
			class="text-xs text-gray-400 hover:text-white flex items-center gap-2 py-1 overflow-hidden overflow-ellipsis break-words whitespace-pre"
		>
			<avatar :userid="replyMessage.author" class="w-4" />
			{{ getMessageText(replyMessage) }}
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.messageBody {
	@apply bg-surface-800 bg-opacity-60
        p-3
        pb-2
        rounded-sm
        max-w-full
        sm:max-w-50ch
        transition
        duration-75;
	box-shadow: 0px 1px 1px #00000050;
	& ::v-deep(a) {
		@apply break-all;
		word-break: break-word;
	}
}

.ownMessage {
	@apply flex-row-reverse;
}

.messageContainer {
	& .messageOptions {
		@apply invisible;
	}

	&:not(.ownMessage) .messageBody.hideAvatar {
		@apply ml-18;
	}

	&.ownMessage .messageBody.hideAvatar {
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
