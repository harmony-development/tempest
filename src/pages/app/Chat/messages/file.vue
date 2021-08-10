<script lang="ts" setup>
import { ContentFiles } from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/harmonytypes/v1/types";
import { defineProps } from "vue";
import Attachment from "./Attachment.vue";

const props = defineProps<{
  content: ContentFiles;
}>();
</script>

<template>
  <Attachment
    v-for="a in props.content.attachments"
    :key="a.id"
    :attachment="a"
    class="mt-2"
  />
</template>
