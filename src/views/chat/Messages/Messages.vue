<script lang="ts" setup>
import { useChatRoute } from "../../../router";
import { computed, nextTick, ref, watch } from 'vue';
import { chatState } from "../../../logic/store/chat";
import Message from "./Message.vue";
import { useIntersectionObserver } from "@vueuse/core";

const loader = ref<HTMLElement | undefined>();
const list = ref<HTMLElement | undefined>(undefined)
const { host, guild, channel } = useChatRoute();

const reachedTop = computed(() => chatState.getChannel(host.value!, guild.value!, channel.value!).reachedTop)

const messageList = computed(() =>
  chatState.getMessageList(host.value!, guild.value!, channel.value!)
);

const loadMoreMessages = () => chatState.fetchMessageList(host.value!, guild.value!, channel.value!, messageList.value[0])

useIntersectionObserver(loader, async ([{ isIntersecting }]) => {
  if (!isIntersecting || reachedTop.value) return;
  const oldPos = list.value!.scrollHeight - list.value!.scrollTop;
  await loadMoreMessages()
  await nextTick()
  list.value!.scrollTop = list.value!.scrollHeight - oldPos;
});

watch(messageList, async () => {
  const container = list.value!
  if (container.scrollHeight - container.scrollTop <= container.clientHeight + 80) {
    await nextTick()
    container.scrollTop = container.scrollHeight
  }
}, { deep: true })
watch([host, guild, channel], async () => {
  const container = list.value!
  await nextTick()
  container.scrollTop = container.scrollHeight
})

watch(messageList, async () => {
  const container = list.value!
  await nextTick()
  if (container.scrollHeight <= container.clientHeight && !reachedTop.value) {
    await loadMoreMessages()
  }
}, { deep: true })

const isConsecutiveMessage = (i: number) => {
  const currentHost = host.value!;
  const currentGuild = guild.value!;
  const currentChannel = channel.value!;

  const previousMessageId = messageList.value?.[i - 1];
  const currentMessageId = messageList.value?.[i];

  const previousMessage = chatState.getMessage(
    currentHost,
    currentGuild,
    currentChannel,
    previousMessageId!
  );
  const currentMessage = chatState.getMessage(
    currentHost,
    currentGuild,
    currentChannel,
    currentMessageId!
  );

  return currentMessage?.author === previousMessage?.author && currentMessage.override?.username === previousMessage.override?.username;
};
</script>

<template>
  <div
    class="flex-1 flex justify-center bg-surface-800 p-3 gap-2 overflow-y-auto w-full compact-scrollbar"
    ref="list"
  >
    <div class="flex flex-col flex-1 gap-2">
      <div ref="loader">
        <mdi-loading class="text-xl animate-spin" v-if="!reachedTop" />
      </div>
      <Message
        v-for="(m, i) in messageList"
        :key="`${host}/${guild}/${channel}/${m}`"
        :messageid="m"
        :data="chatState.getMessage(host!, guild!, channel!, m)"
        :hide-avatar="isConsecutiveMessage(i)"
      />
    </div>
  </div>
</template>
