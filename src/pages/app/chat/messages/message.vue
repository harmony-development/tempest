<script lang="ts" setup>
import { computed, defineProps } from "vue";
import { userID } from "~/logics/app";
import { useAppRoute } from "~/logics/location";
import { appState } from "~/store/app";
import Avatar from "~/components/Avatar.vue";
import { convertDate } from "~/logics/time";
import HBtn from "~/components/HBtn.vue";

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
      :class="{ avatar: true, 'own-avatar': isOwnMessage }"
      :userid="message?.author"
      :uri="message?.override?.avatar"
    />
    <div :class="{ bubble: true, 'own-bubble': isOwnMessage }">
      <p class="text-sm text-gray-200">
        <span :title="`Bridged by ${user?.username}`">
          <mdi-link v-if="message?.override?.reason === 'bridge'" />
        </span>
        {{ message.override?.username || user?.username || message.author }}
      </p>
      <p>{{ message?.content }}</p>
      <p class="mt-1 text-right text-sm text-gray-300">{{ displayDate }}</p>
    </div>
    <div class="h-full menu">
      <h-btn variant="text" icon dense class="mx-1">
        <mdi-dots-vertical />
      </h-btn>
    </div>
  </div>
</template>

<style lang="postcss">
.menu {
  @apply invisible;
}

.message {
  @apply flex mb-4;
  &:hover > .menu {
    @apply visible;
  }
}

.own-msg {
  @apply flex-row-reverse;
}

.bubble {
  @apply rounded bg-green-700 min-h-12 max-w-full sm:max-w-3/4 px-4 py-3 items-center break-all whitespace-pre-line;
}

.own-bubble {
  @apply bg-blue-700;
}

.avatar {
  @apply h-6 w-6;
}

.avatar:not(.own-avatar) {
  @apply mr-4;
}

.own-avatar {
  @apply ml-4;
}
</style>
