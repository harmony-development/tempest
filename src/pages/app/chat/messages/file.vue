<script lang="ts" setup>

import { ContentFiles } from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/harmonytypes/v1/types";
import { computed, defineProps } from "vue";
import Attachment from "./Attachment.vue";
import { userID } from "~/logics/app";
import { useAppRoute } from "~/logics/location";
import { convertDate } from "~/logics/time";
import { appState } from "~/store/app";

const route = useAppRoute();
const props = defineProps<{
  content: ContentFiles;
  messageid: string;
}>();
const message = computed(() =>
  appState.getMessage(route.value.host, props.messageid)
);
const user = computed(() =>
  appState.getUser(route.value.host, message.value.author)
);
const isOwnMessage = computed(() => message.value.author === userID.value);
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
    <Attachment
        v-for="a in content.attachments"
        :key="a.id"
        :attachment="a"
        class="mt-2"
      />
    <p class="mt-1 text-right text-sm text-gray-300">
      {{ displayDate }}
      <i v-if="message.editedAt">(Edited {{ editedAtDate }})</i>
    </p>
  </div>
</template>
