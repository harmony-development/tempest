<script lang="ts" setup>
import { onKeyPressed, onKeyStroke, useIntersectionObserver } from "@vueuse/core";
import type { Ref } from "vue";
import { computed, nextTick, ref, toRefs, watch } from "vue";
import { useI18n } from "vue-i18n";
import { chatState } from "../../../logic/store/chat";
import { useAPI } from "../../../services/api";
import Message from "./Message.vue";

const props = defineProps<{
	host: string
	guild: string
	channel: string
}>();

const { host, guild, channel } = toRefs(props);
const api = useAPI();
const { t } = useI18n();

const loader = ref() as Ref<HTMLElement>;
const list = ref() as Ref<HTMLElement>;

const reachedTop = computed(() => chatState.getChannel(host.value, guild.value, channel.value).reachedTop);
const messageList = computed(() => chatState.getMessageList(host.value, guild.value, channel.value));

const loadMoreMessages = () => api.fetchMessageList(host.value, guild.value, channel.value, {
	messageId: messageList.value?.[0],
});
const scrollToBottom = () => (list.value.scrollTop = list.value.scrollHeight);

onKeyStroke("escape", () => scrollToBottom());

useIntersectionObserver(loader, async([{ isIntersecting }]) => {
	if (!isIntersecting || reachedTop.value) return;
	const oldPos = list.value.scrollHeight - list.value.scrollTop;
	await nextTick();
	await loadMoreMessages();
	list.value.scrollTop = list.value.scrollHeight - oldPos;
});

watch(
	messageList,
	async() => {
		const container = list.value;
		if (container.scrollHeight - container.scrollTop <= container.clientHeight + 80) {
			await nextTick();
			scrollToBottom();
		}
	},
	{ deep: true },
);

watch(
	channel,
	async() => {
		await nextTick();
		scrollToBottom();
	},
	{ immediate: true },
);

watch(
	messageList,
	async() => {
		if (!messageList.value) return;
		const container = list.value;
		// load more messages to fill viewport
		await nextTick();
		if (container.scrollHeight <= container.clientHeight && !reachedTop.value) {
			await loadMoreMessages();
			await nextTick();
		}
	},
	{ deep: true },
);

const isConsecutiveMessage = (i: number) => {
	const previousMessage = chatState.getMessage(props.host, props.guild, props.channel, messageList.value[i - 1]);
	const currentMessage = chatState.getMessage(props.host, props.guild, props.channel, messageList.value[i]);

	return (
		currentMessage?.author === previousMessage?.author
		&& currentMessage?.override?.username === previousMessage?.override?.username
	);
};
</script>

<template>
  <div ref="list" class="p-2 sm:p-7 gap-2 overflow-y-auto w-full compact-scrollbar flexcol flex-1">
    <div class="flexcol flex-1 gap-2">
      <div ref="loader">
        <mdi-loading v-if="!reachedTop" class="text-xl animate-spin" />
      </div>
      <Message
        v-for="(m, i) in messageList"
        :key="`${host}/${guild}/${channel}/${m}`"
        :messageid="m"
        :host="host"
        :guildid="guild"
        :channelid="channel"
        :data="chatState.getMessage(host, guild, channel, m)!"
        :hide-avatar="isConsecutiveMessage(i)"
      />
    </div>
  </div>
</template>
