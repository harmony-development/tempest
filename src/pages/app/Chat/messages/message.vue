<script lang="ts" setup>
import { computed, defineProps, nextTick, ref } from "vue";
import FileMessage from "./file.vue";
import TextMessage from "./text.vue";
import Unsupported from "./unsupported.vue";
import { userID } from "~/logic/app";
import { useAppRoute } from "~/logic/location";
import { appState } from "~/store/app";
import HImage from "~/components/HImage.vue";
import HBtn from "~/components/shared/HBtn.vue";
import HList from "~/components/HList.vue";
import HListItem from "~/components/HListItem.vue";
import HMenu from "~/components/HMenu.vue";
import { getOrFederate } from "~/logic/connections";
import { convertDate } from "~/logic/time";

const route = useAppRoute();
const props = defineProps<{
  messageid: string;
}>();
const menuOpen = ref(false);
const editing = ref(false);
const editText = ref("");
const editFocus = ref(false);
const message = computed(() =>
  appState.getMessage(route.value.host, props.messageid)
);
const user = computed(() =>
  appState.getUser(route.value.host, message.value.author)
);

const isOwnMessage = computed(() => message.value.author === userID.value);

const displayDate = computed(() => {
  return convertDate(message.value.createdAt);
});
const editedAtDate = computed(() => {
  return convertDate(message.value.editedAt);
});

const deleteMessage = async () => {
  const conn = await getOrFederate(route.value.host);
  await conn.chat.deleteMessage({
    guildId: route.value.guildid as string,
    channelId: route.value.channelid as string,
    messageId: props.messageid,
  });
};

const editStart = async () => {
  if (message.value.content?.content.oneofKind !== "textMessage") {
    return;
  }
  editing.value = true;
  editText.value = message.value.content.content.textMessage.content;
  await nextTick();
  editFocus.value = !editFocus.value;
};
const content = computed(() => {
  return message.value.content?.content;
});
</script>

<template>
  <div :class="{ message: true, 'own-msg': isOwnMessage }">
    <h-image
      :class="{ avatar: true, 'own-avatar': isOwnMessage }"
      :userid="message?.author"
      :uri="message?.override?.avatar"
      rounded
    />
    <div :class="{ bubble: true, 'own-bubble': isOwnMessage }">
      <p
        class="text-xs dark:text-gray-200 text-gray-500 flex items-center gap-1"
      >
        <span
          v-if="message?.override?.reason === 'bridge'"
          :title="`Bridged by ${user?.username}`"
          class="flex align-middle"
        >
          <mdi-link />
        </span>
        {{ message.override?.username || user?.username || message.author }}
      </p>
      <FileMessage
        v-if="content?.oneofKind === 'filesMessage'"
        :content="content.filesMessage"
      />
      <!-- <EmbedMessage v-else-if="messageType === 'embedMessage'"> </EmbedMessage> -->
      <TextMessage
        v-else-if="content?.oneofKind === 'textMessage'"
        v-model:editing="editing"
        :content="content.textMessage"
        :messageid="messageid"
      />
      <unsupported v-else> </unsupported>
      <p class="mt-1 text-right text-xs text-gray-700 dark:text-gray-300">
        {{ displayDate }}
        <i v-if="message.editedAt > 0">(Edited {{ editedAtDate }})</i>
      </p>
    </div>

    <div class="h-full">
      <h-menu v-model="menuOpen">
        <template #activator="{ toggle }">
          <h-btn variant="text" icon dense class="mx-1 menu" @click="toggle">
            <mdi-dots-vertical />
          </h-btn>
        </template>
        <h-list
          class="bg-light-400 dark:bg-black w-max overflow-hidden"
          @click="menuOpen = false"
        >
          <h-list-item v-if="isOwnMessage" @click="editStart">
            <mdi-pencil class="mr-1" />
            Edit Message
          </h-list-item>
          <h-list-item class="text-red-400" @click="deleteMessage">
            <mdi-delete class="mr-1" />
            Delete Message
          </h-list-item>
        </h-list>
      </h-menu>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.menu {
  @apply invisible;
}

.message {
  @apply flex mb-4;
  &:hover .menu {
    @apply visible;
  }
}

.own-msg {
  @apply flex-row-reverse;
}

.bubble {
  @apply rounded border-harmonydark-500 border-1 min-h-12 max-w-full bg-light-400 dark:bg-harmonydark-700
  sm:max-w-3/4 px-4 py-3 items-center break-all 
  whitespace-pre-line;
}

.avatar {
  @apply h-6 w-6 flex-shrink-0;
}

.avatar:not(.own-avatar) {
  @apply mr-4;
}

.own-avatar {
  @apply ml-4;
}
</style>
