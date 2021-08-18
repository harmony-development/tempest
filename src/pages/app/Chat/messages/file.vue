<script lang="ts" setup>
import { ContentFiles } from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/harmonytypes/v1/types";
import { defineProps } from "vue";
import Attachment from "../../../../components/shared/Image/Attachment.vue";

const props = defineProps<{
  content: ContentFiles;
}>();
</script>

<template>
  <Attachment
    v-for="a in props.content.attachments"
    :key="a.id"
    :file-name="a.name"
    :file-src="a.id"
    :type="a.type"
    :size="a.size"
    class="mt-2"
  />
</template>
