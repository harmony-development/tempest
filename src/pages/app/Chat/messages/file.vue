<script lang="ts" setup>
import { Content_AttachmentContent } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import { defineProps } from "vue";
import AttachmentVue from "../../../../components/shared/Image/Attachment.vue";

const props = defineProps<{
  content: Content_AttachmentContent;
}>();
</script>

<template>
  <AttachmentVue
    v-for="a in props.content.files"
    :key="a.id"
    :file-name="a.name"
    :file-src="a.id"
    :type="a.mimetype"
    :size="a.size"
    class="mt-2"
  />
</template>
