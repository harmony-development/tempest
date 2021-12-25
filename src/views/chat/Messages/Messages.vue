<script lang="ts" setup>
import { useIntersectionObserver } from "@vueuse/core";
import { computed, nextTick, Ref, ref, toRefs, watch } from "vue";
import { chatState } from "../../../logic/store/chat";
import Message from "./Message.vue";

const props = defineProps<{
  host: string;
  guild: string;
  channel: string;
}>();

const { host, guild, channel } = toRefs(props);

const loader = <Ref<HTMLElement>>ref();
const list = <Ref<HTMLElement>>ref();

const reachedTop = computed(
  () => chatState.getChannel(host.value, guild.value, channel.value).reachedTop
);

const messageList = computed(() =>
  chatState.getMessageList(host.value, guild.value, channel.value)
);

const loadMoreMessages = () =>
  chatState.fetchMessageList(
    host.value,
    guild.value,
    channel.value,
    messageList.value?.[0]
  );
const scrollToBottom = () => (list.value.scrollTop = list.value.scrollHeight);

useIntersectionObserver(loader, async ([{ isIntersecting }]) => {
  if (!isIntersecting || reachedTop.value) return;
  const oldPos = list.value.scrollHeight - list.value.scrollTop;
  await nextTick();
  await loadMoreMessages();
  list.value.scrollTop = list.value.scrollHeight - oldPos;
});

watch(
  messageList,
  async () => {
    const container = list.value;
    if (
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 80
    ) {
      console.log("before2");
      await nextTick();
      console.log("after2");
      scrollToBottom();
    }
  },
  { deep: true }
);

watch(
  channel,
  async () => {
    await nextTick();
    scrollToBottom();
  },
  { immediate: true }
);

watch(
  messageList,
  async () => {
    if (!messageList.value) return;
    const container = list.value;
    // load more messages to fill viewport
    await nextTick();
    if (container.scrollHeight <= container.clientHeight && !reachedTop.value) {
      await loadMoreMessages();
      await nextTick();
    }
  },
  { deep: true }
);

const isConsecutiveMessage = (i: number) => {
  const previousMessage = chatState.getMessage(
    props.host,
    props.guild,
    props.channel,
    messageList.value[i - 1]
  );
  const currentMessage = chatState.getMessage(
    props.host,
    props.guild,
    props.channel,
    messageList.value[i]
  );

  return (
    currentMessage?.author === previousMessage?.author &&
    currentMessage?.override?.username === previousMessage?.override?.username
  );
};
</script>

<template>
  <div
    class="
      flex-1 flex
      justify-center
      bg-surface-1000
      p-3
      gap-2
      overflow-y-auto
      w-full
      compact-scrollbar
    "
    ref="list"
  >
    <div class="flexcol flex-1 gap-2">
      <div ref="loader">
        <mdi-loading class="text-xl animate-spin" v-if="!reachedTop" />
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
