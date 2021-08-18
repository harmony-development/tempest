<script lang="ts" setup>
import { MediaMetadata } from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/mediaproxy/v1/mediaproxy";
import Attachment from "~/components/shared/Image/Attachment.vue";

defineProps<{
  mediaEmbed: MediaMetadata;
  src: string;
}>();
</script>

<template>
  <Attachment
    :file-src="src"
    :file-name="mediaEmbed.filename"
    :type="mediaEmbed.mimetype"
  />
</template>
