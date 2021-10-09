<script lang="ts" setup>
import { Content_TextContent } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";

const props = defineProps<{
  content: Content_TextContent["content"];
}>();
</script>

<template>
  <p class="content-out whitespace-pre-wrap">
    {{ content?.text }}
  </p>
</template>
<style lang="postcss" scoped>
p {
  @apply inline-block;
}
.content-out:deep(.codeblock) {
  @apply w-full block break-all break-words whitespace-pre-wrap pr-3 rounded-md bg-black;
}
.content-out >>> .codeblock > code {
  @apply break-all w-full block p-3 pl-4 break-all break-words whitespace-pre-wrap;
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
.content-out >>> a {
  @apply text-primary-300 underline;
}
</style>
