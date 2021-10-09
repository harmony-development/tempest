<script lang="ts" setup>
import { FormattedText } from "@harmony-dev/harmony-web-sdk/dist/gen/harmonytypes/v1/types";
import HInput from "~/components/shared/HInput.vue";
import { connectionManager } from "../../../logic/api/connections";
import { useChatRoute } from "../../../router";
import { ref } from "vue";

const { host, guild, channel } = useChatRoute();

const text = ref("");

const onKeyDown = async (ev: KeyboardEvent) => {
  if (ev.key === "Enter" && !ev.shiftKey) {
    ev.preventDefault();
    const content = text.value;
    text.value = "";
    await connectionManager.get(host.value!).chat.sendMessage({
      guildId: guild.value!,
      channelId: channel.value!,
      content: {
        content: {
          oneofKind: "textMessage",
          textMessage: {
            content: FormattedText.create({
              text: content,
            }),
          },
        },
      },
    });
  }
};
</script>
<template>
  <div class="p-1">
    <HInput
      multiline
      no-border
      label="Write your message..."
      :rows="1"
      class="!bg-surface-900"
      v-model="text"
      @keydown="onKeyDown"
    />
  </div>
</template>
