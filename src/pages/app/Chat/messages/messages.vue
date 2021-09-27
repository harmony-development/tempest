<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useEventListener, useThrottleFn } from "@vueuse/core";
import Message from "./message.vue";
import HSpinner from "~/components/HSpinner.vue";
import { useAppRoute } from "~/logic/location";
import { appState } from "~/store/app";
import { useFetchMessages, useMessageList } from "~/logic/fetcher";

const route = useAppRoute();

const messagesContainer = ref<HTMLDivElement | null>(null);

const chan = computed(() =>
  appState.getChannel(route.value.host, route.value.channelid)
);
const messages = useMessageList();
const reachedTop = computed(() => chan.value.reachedTop);

const scrollToBottom = () => {
  if (messagesContainer.value)
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
};

const fetchMessages = useFetchMessages();

onMounted(async () => {
  await fetchMessages(
    route.value.host,
    route.value.guildid,
    route.value.channelid
  );
  await nextTick();
  scrollToBottom();
});

watch(route, async (curr, prev) => {
  if (curr.channelid === prev.channelid && curr.host === prev.host) return;
  if (!curr.channelid || reachedTop.value) return;
  await fetchMessages(
    route.value.host,
    route.value.guildid,
    route.value.channelid
  );
  await nextTick();
  scrollToBottom();
});

watch(
  messages,
  async () => {
    if (messagesContainer.value) {
      if (
        messagesContainer.value.scrollHeight -
          messagesContainer.value.offsetHeight -
          messagesContainer.value.scrollTop <=
        200
      ) {
        await nextTick();
        scrollToBottom();
      }
    }
  },
  { deep: true }
);

const scrollHandler = useThrottleFn(async (ev: Event) => {
  if (reachedTop.value) return;
  const target = ev.target as HTMLDivElement;
  const previousScrollPos = target.scrollHeight - target.scrollTop;
  if (target.scrollTop === 0) {
    await fetchMessages(
      route.value.host,
      route.value.guildid,
      route.value.channelid,
      messages.value?.[0]
    );
    await nextTick();
    target.scrollTop = target.scrollHeight - previousScrollPos;
  }
}, 200);

useEventListener(messagesContainer, "scroll", scrollHandler);
</script>
<template>
  <div ref="messagesContainer" class="container flex flex-col">
    <div v-if="!reachedTop" class="text-center">
      <h-spinner class="my-1 text-center" />
    </div>
    <message v-for="message in messages" :key="message" :messageid="message" />
  </div>
</template>

<style lang="postcss" scoped>
.container {
  @apply flex-1 p-4 overflow-x-auto;

  &::-webkit-scrollbar {
    @apply bg-surface-700 w-2 transition duration-200;
  }

  &::-webkit-scrollbar-thumb {
    @apply bg-black rounded;
  }
}
</style>
