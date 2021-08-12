<script lang="ts" setup>
import { ContentText } from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/harmonytypes/v1/types";
import DOMPurify from "dompurify";
import { computed, defineProps } from "vue";
import { conv } from "~/logics/markdown";
import { parseLinks } from "~/logics/utils/parsing";

const props = defineProps<{
  content: ContentText;
}>();

const sanitized = computed(() => {
  return DOMPurify.sanitize(conv.makeHtml(props.content.content));
});

const links = computed(() => {
  return parseLinks(props.content.content);
});
</script>

<template>
  <p class="content-out whitespace-pre-wrap" v-html="sanitized" />
</template>

<style lang="postcss" scoped>
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
