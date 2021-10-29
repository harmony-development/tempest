<script lang="ts" setup>
import { FormattedText } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import HInput from "~/components/shared/HInput.vue";
import { connectionManager } from "../../../logic/api/connections";
import { useChatRoute } from "../../../router";
import { ref } from "vue";
import HBtn from "~/components/shared/HBtn.vue";
import MessageTypePicker from "./MessageTypePicker.vue";
import { onClickOutside } from '@vueuse/core';
import PopInTransition from "~/components/transitions/PopInTransition.vue";

const { host, guild, channel } = useChatRoute();

const pickerOpen = ref(false)
const picker = ref<HTMLElement | undefined>(undefined)
const text = ref("");

onClickOutside(picker, () => pickerOpen.value = false)

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
  <div class="flex items-center p-1 bg-surface-900">
    <div class="relative">
      <PopInTransition>
        <MessageTypePicker
          class="absolute bottom-[120%] picker"
          v-if="pickerOpen"
          ref="picker"
          @sent="pickerOpen = false"
        />
      </PopInTransition>
      <HBtn variant="text" icon class="picker-button" @click="pickerOpen = true">
        <mdi-add :class="{ pickerOpen }" class="transition-all duration-100" />
      </HBtn>
    </div>
    <HInput
      multiline
      no-border
      label="Write your message..."
      name="message-input"
      :rows="1"
      class="!bg-transparent w-full"
      v-model="text"
      @keydown="onKeyDown"
    />
  </div>
</template>

<style lang="postcss" scoped>
.pickerOpen {
  @apply transform rotate-45;
}
</style>