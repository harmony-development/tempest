<script lang="ts" setup>
import type { Content_AttachmentContent } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import { parseHMC } from "../../../logic/parsing";
import { useChatRoute } from "../../../router";
import BaseButton from "~/components/base/BaseButton.vue";

const { host } = useChatRoute();

defineProps<{
	content: Content_AttachmentContent["files"]
}>();

const hmc = (id: string) => parseHMC(id, host.value!);
</script>

<template>
  <div class="flexcol gap-3">
    <div v-for="file in content" :key="file.id" class="rounded-sm overflow-hidden">
      <div v-if="file.mimetype.startsWith('image/')" class="w-100 h-36 relative">
        <div
          class="absolute z-1 top-0 left-0 h-full w-1/2 bg-cover bg-no-repeat"
          :style="{ backgroundImage: `url(${hmc(file.id)})` }"
        />
        <div class="relative p-3 h-full z-10 image-container text-right flexcol">
          <p>{{ file.name }}</p>
          <p class="text-xs text-gray-400">
            {{ file.size }} Bytes
          </p>
          <div class="flex-1" />
          <div>
            <base-button icon target="_blank" :href="hmc(file.id)">
              <mdi:download />
            </base-button>
          </div>
        </div>
      </div>
      <audio v-else-if="file.mimetype.startsWith('audio/')" controls :src="hmc(file.id)" />
      <a v-else :href="hmc(file.id)">{{ file.name }}</a>
    </div>
  </div>
</template>
<style lang="postcss" scoped>
.image-container {
	background: linear-gradient(to left, rgb(var(--surface-900)) 60%, transparent 120%);
}
</style>
