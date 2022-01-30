<script lang="ts" setup>
import type { Content_AttachmentContent } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import { parseHMC } from "../../../logic/parsing";
import { useChatRoute } from "../../../router";
import Attachment from "./Attachment.vue";
import BaseButton from "~/components/base/BaseButton.vue";

const { host } = useChatRoute();

defineProps<{
	content: Content_AttachmentContent["files"]
}>();

const hmc = (id: string) => parseHMC(id, host.value!);
</script>

<template>
  <div class="flexcol gap-3">
    <div v-for="{id, mimetype, name, size} in content" :key="id" class="rounded-sm overflow-hidden">
      <attachment :id="id" :host="host!" :mimetype="mimetype" :name="name" :size="size" />
    </div>
  </div>
</template>
<style lang="postcss" scoped>
.image-container {
	background: linear-gradient(to left, rgb(var(--surface-900)) 60%, transparent 120%);
}
</style>
