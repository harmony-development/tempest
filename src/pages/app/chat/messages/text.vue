<script lang="ts" setup>
import { ContentText } from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/harmonytypes/v1/types";
import DOMPurify from "dompurify";
import { computed, defineProps } from "vue";
import { userID } from "~/logics/app";
import { useAppRoute } from "~/logics/location";
import { conv } from "~/logics/markdown";
import { convertDate } from "~/logics/time";
import { appState } from "~/store/app";

const route = useAppRoute();
const props = defineProps<{
  content: ContentText;
  messageid: string;
}>();
const message = computed(() =>
  appState.getMessage(route.value.host, props.messageid)
);
const user = computed(() =>
  appState.getUser(route.value.host, message.value.author)
);
const isOwnMessage = computed(() => message.value.author === userID.value);
const sanitized = computed(() => {
  return DOMPurify.sanitize(conv.makeHtml(props.content.content));
});
const displayDate = computed(() => convertDate(message.value.createdAt));
const editedAtDate = computed(() => convertDate(message.value.editedAt));
</script>

<template>
  <div :class="{ bubble: true, 'own-bubble': isOwnMessage }">
    <p class="text-sm text-gray-200">
      <span :title="`Bridged by ${user?.username}`">
        <mdi-link v-if="message?.override?.reason === 'bridge'" />
      </span>
      {{ message.override?.username || user?.username || message.author }}
    </p>
    <p class="content-out whitespace-pre-wrap" v-html="sanitized" />
    <p class="mt-1 text-right text-sm text-gray-300">
      {{ displayDate }}
      <i v-if="message.editedAt">(Edited {{ editedAtDate }})</i>
    </p>
  </div>
</template>

<style lang="postcss" scoped>
.content-out:deep(.codeblock) {
  width: 100%;
  display: block;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-all;
  white-space: pre-wrap;
  padding-right: 12px;
  @apply w-full block break-all pr-2 rounded-md bg-black;
}
.content-out >>> .codeblock > code {
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-all;
  width: 100%;
  display: block;
  padding: 8px;
  padding-left: 12px;
}
.content-out >>> .msg-p {
  margin-bottom: 0px;
  width: auto;
}
.content-out >>> .emoji {
  height: 1em;
  vertical-align: middle;
}
.content-out >>> .big-emoji {
  height: 3em;
}
</style>
