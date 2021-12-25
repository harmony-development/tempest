<script lang="ts" setup>
import { Content_AttachmentContent } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import HBtn from "~/components/shared/HBtn.vue";
import { parseHMC } from '../../../logic/parsing';
import { useChatRoute } from '../../../router';

const { host } = useChatRoute();

const props = defineProps<{
  content: Content_AttachmentContent['files'];
}>();

const hmc = (id: string) => parseHMC(id, host.value!);
</script>

<template>
  <div class="flexcol gap-3">
    <div v-for="file in content" :key="file.id" class="rounded-md overflow-hidden">
      <div class="w-100 h-36 relative" v-if="file.mimetype.startsWith('image/')">
        <div
          class="absolute z-1 top-0 left-0 h-full w-1/2 bg-cover bg-no-repeat"
          :style="{ backgroundImage: `url(${hmc(file.id)})` }"
        />
        <div class="relative p-3 h-full z-10 image-container text-right flexcol">
          <p>{{ file.name }}</p>
          <p class="text-xs text-gray-400">{{ file.size }} Bytes</p>
          <div class="flex-1" />
          <div>
            <HBtn icon target="_blank" :href="hmc(file.id)">
              <mdi:download />
            </HBtn>
          </div>
        </div>
      </div>
      <audio controls :src="hmc(file.id)" v-else-if="file.mimetype.startsWith('audio/')" />
      <a :href="hmc(file.id)" v-else>{{ file.name }}</a>
    </div>
  </div>
</template>
<style lang="postcss" scoped>
.image-container {
  background: linear-gradient(
    to left,
    rgb(var(--surface-900)) 60%,
    transparent 120%
  );
}
</style>
