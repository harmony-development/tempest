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
    <p class="content-out" v-html="sanitized" />
    <p class="mt-1 text-right text-sm text-gray-300">
      {{ displayDate }}
      <i v-if="message.editedAt">(Edited {{ editedAtDate }})</i>
    </p>
  </div>
</template>
