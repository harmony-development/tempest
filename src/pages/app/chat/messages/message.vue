<script lang="ts" setup>
import { computed, defineProps, nextTick, ref } from "vue";
import { UpdateMessageTextRequest } from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/chat/v1/messages";
import DOMPurify from "dompurify";
import { ContentEmbed, ContentFiles, ContentText } from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/harmonytypes/v1/types";
import FileMessage from "./file.vue";
import EmbedMessage from "./embeds.vue";
import TextMessage from "./text.vue";
import { userID } from "~/logics/app";
import { useAppRoute } from "~/logics/location";
import { appState } from "~/store/app";
import HImage from "~/components/HImage.vue";
import { convertDate } from "~/logics/time";
import HBtn from "~/components/HBtn.vue";
import HList from "~/components/HList.vue";
import HListItem from "~/components/HListItem.vue";
import { getOrFederate } from "~/logics/connections";
import { conv } from "~/logics/markdown";
import Unsupported from "./unsupported.vue";


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

const messageType = computed(() => {
  return message.value.content.content.oneofKind
})

const deleteMessage = async () => {
  const conn = await getOrFederate(route.value.host);
  await conn.chat.deleteMessage({
    guildId: route.value.guildid as string,
    channelId: route.value.channelid as string,
    messageId: props.messageid,
  });
};

const editMessage = async (content: string) => {
  const conn = await getOrFederate(route.value.host);
  await conn.chat.updateMessageText(
    UpdateMessageTextRequest.create({
      guildId: route.value.guildid as string,
      channelId: route.value.channelid as string,
      messageId: props.messageid,
      newContent: content,
    })
  );
};

const onEditKeyDown = async (ev: KeyboardEvent) => {
  if (ev.key === "Enter" && !ev.shiftKey) {
    ev.preventDefault();
    editMessage(editText.value);
    editing.value = false;
  }
  if (ev.key === "Escape") {
    ev.preventDefault();
    editing.value = false;
  }
};

const editStart = async () => {
  if (message.value.content.content.oneofKind !== "textMessage") {
    return
  }
  editing.value = true;
  editText.value = message.value.content.content.textMessage.content;
  await nextTick();
  editFocus.value = !editFocus.value;
};
const content = computed(() => {
  return message.value.content.content
})
</script>

<template>
  <div :class="{ message: true, 'own-msg': isOwnMessage }">
    <h-image
      :class="{ avatar: true, 'own-avatar': isOwnMessage }"
      :userid="message?.author"
      :uri="message?.override?.avatar"
      rounded
    />

    <!-- begin switch -->
    <FileMessage v-if="content.oneofKind === 'filesMessage'" :messageid="messageid" :content="content.filesMessage"> </FileMessage>
    <!-- <EmbedMessage v-else-if="messageType === 'embedMessage'"> </EmbedMessage> -->
    <TextMessage v-else-if="content.oneofKind === 'textMessage'" :messageid="messageid" :content="content.textMessage"> </TextMessage>
    <unsupported v-else> </unsupported>
    <!-- end switch -->

    <div class="h-full menu">
      <h-menu v-model="menuOpen">
        <template #activator="{ toggle }">
          <h-btn variant="text" icon dense class="mx-1" @click="toggle">
            <mdi-dots-vertical />
          </h-btn>
        </template>
        <h-list class="bg-black" @click="menuOpen = false">
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

