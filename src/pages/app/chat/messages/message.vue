<script lang="ts" setup>
import { computed, defineProps } from "vue";
import { userID } from "~/logics/app";
import { useAppRoute } from "~/logics/location";
import { appState } from "~/store/app";
import Avatar from "~/components/Avatar.vue";
import { convertDate } from "~/logics/time";

const route = useAppRoute();
const props = defineProps<{
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
</script>

<template>
  <div :class="{ message: true, 'own-msg': isOwnMessage }">
    <avatar
      v-if="!isOwnMessage"
      class="h-6 mr-4 w-6"
      :userid="message?.author"
    />
    <div :class="{ bubble: true, 'own-bubble': isOwnMessage }">
      <p class="text-sm text-gray-200">
        {{ user?.username || message.author }}
      </p>
      <p>{{ message?.content }}</p>
      <p class="mt-1 text-right text-sm text-gray-300">{{ displayDate }}</p>
    </div>
    <avatar
      v-if="isOwnMessage"
      class="h-6 ml-4 w-6"
      :userid="message?.author"
    />
  </div>
</template>

<style lang="postcss">
.message {
  @apply flex mb-4;
}

.own-msg {
  @apply justify-end;
}

.bubble {
  @apply rounded bg-green-700 min-h-12 max-w-full sm:max-w-3/4 px-4 py-3 items-center break-all whitespace-pre-line;
}

.own-bubble {
  @apply bg-blue-700;
}
</style>
