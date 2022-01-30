<script lang="ts" setup>
import type { Content_PhotoContent } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import { ref } from "vue";
import { parseHMC } from "../../../logic/parsing";
import { useChatRoute } from "../../../router";
import BaseButton from "~/components/base/BaseButton.vue";

const { host } = useChatRoute();

defineProps<{
	content: Content_PhotoContent["photos"]
}>();

const loaded = ref(false);
const error = ref(false);

const getThumbnail = (data: Uint8Array) => URL.createObjectURL(new Blob([data], { type: "image/jpeg" }));
</script>

<template>
  <div class="flexcol gap-2">
    <div v-for="file in content" :key="file.hmc" class="relative rounded-sm overflow-hidden">
      <div
        :style="{
          width: '400px',
          maxWidth: `${file.width}px`,
          paddingBottom: `calc(${file.height} / ${file.width} * 100%`,
        }"
      />
      <img
        v-if="!error"
        :src="parseHMC(file.hmc, host!)"
        class="absolute top-0 left-0"
        @load="loaded = true"
        @error="error = true"
      >
      <div
        v-if="!loaded"
        class="bg-cover absolute top-0 left-0 w-full h-full"
        :style="{
          backgroundImage: `url('${file.minithumbnail?.data && getThumbnail(file.minithumbnail?.data)}')`,
        }"
      >
        <div
          class="
						w-full
						h-full
						absolute
						backdrop-filter backdrop-blur-md backdrop-brightness-50
						flex
						items-center
						justify-center
						text-6xl
					"
        >
          <div v-if="error" class="w-full text-center">
            <mdi:alert-circle-outline />
            <p class="text-xl">
              {{ $t('failed-to-load-image') }}
            </p>
            <base-button
              variant="outlined"
              class="text-sm uppercase inline-block"
              @click="
                loaded = false;
                error = false;
              "
            >
              {{ $t('reload') }}
            </base-button>
          </div>
          <mdi:loading v-else class="animate-spin" />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="postcss" scoped></style>
