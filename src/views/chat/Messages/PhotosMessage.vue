<script lang="ts" setup>
import { Content_PhotoContent } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import { ref } from 'vue';
import HBtn from "~/components/shared/HBtn.vue";
import { parseHMC } from '../../../logic/parsing';
import { useChatRoute } from '../../../router';

const { host } = useChatRoute();

const props = defineProps<{
  content: Content_PhotoContent['photos'];
}>();

const loaded = ref(false)
const error = ref(false)

const getThumbnail = (data: Uint8Array) => URL.createObjectURL(new Blob([data], { type: 'image/jpeg' }));
</script>

<template>
  <div class="flexcol gap-2">
    <div v-for="file in content" :key="file.hmc" class="relative rounded-md overflow-hidden">
      <div
        :style="{ width: '400px', maxWidth: `${file.width}px`, paddingBottom: `calc(${file.height} / ${file.width} * 100%` }"
      />
      <img
        :src="parseHMC(file.hmc, host!)"
        @load="loaded = true"
        @error="error = true"
        v-if="!error"
        class="absolute top-0 left-0"
      />
      <div
        class="bg-cover absolute top-0 left-0 w-full h-full"
        :style="{ backgroundImage: `url('${file.minithumbnail?.data && getThumbnail(file.minithumbnail?.data)}')` }"
        v-if="!loaded"
      >
        <div
          class="w-full h-full absolute backdrop-filter backdrop-blur-md backdrop-brightness-50 flex items-center justify-center text-6xl"
        >
          <div v-if="error" class="w-full text-center">
            <mdi:alert-circle-outline />
            <p class="text-xl">Failed to load image</p>
            <HBtn
              variant="outlined"
              class="text-sm uppercase inline-block"
              @click="loaded = false; error = false"
            >Reload</HBtn>
          </div>
          <mdi:loading v-else class="animate-spin" />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="postcss" scoped>
</style>
