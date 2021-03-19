<script lang="ts" setup>
import { computed, defineProps } from "vue";
import { userID } from "~/logics/app";
import { useAppRoute } from "~/logics/location";
import { appState } from "~/store/app";
import Avatar from "~/components/Avatar.vue";

const route = useAppRoute();
const props = defineProps<{
  messageid: string;
}>();

const message = appState.getMessage(route.value.host, props.messageid);

const isOwnMessage = computed(() => message.author === userID.value);
</script>

<template>
  <div :class="{ message: true, 'own-msg': isOwnMessage }">
    <avatar class="h-6 mr-4 w-6" :userid="message?.author" />
    <div :class="{ bubble: true, 'own-bubble': isOwnMessage }">
      <p>{{ message?.content }}</p>
    </div>
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
  @apply rounded flex bg-green-500 min-h-12 max-w-1/2 p-4 items-center break-all whitespace-pre-line;
}

.own-bubble {
  @apply bg-blue-500;
}
</style>
