<script lang="ts" setup>
import type { Attachment } from "@harmony-dev/harmony-web-sdk/dist/lib/protocol/harmonytypes/v1/types";
import { computed, defineProps } from "vue";
import { parseHMC } from "~/logics/harmonyAPI";
import { useAppRoute } from "~/logics/location";
import HBtn from "~/components/HBtn.vue";

const props = defineProps<{
  attachment: Attachment;
}>();
const route = useAppRoute();

const src = computed(() => parseHMC(props.attachment.id, route.value.host));
</script>

<template>
  <img v-if="props.attachment.type.startsWith('image/')" :src="src" />
  <video v-else-if="props.attachment.type.startsWith('video/')" controls>
    <source :src="src" :type="props.attachment.type" />
  </video>
  <audio
    v-else-if="props.attachment.type.startsWith('audio/')"
    controls
    class="attachment"
    :src="src"
  />
  <div
    v-else
    class="outline-dotted-white border-1 p-3 bg-white text-primary-600"
  >
    <p class="text-lg">{{ props.attachment.name }}</p>
    <p class="text-xs">{{ props.attachment.size }} Bytes</p>
    <div class="flex mt-2">
      <h-btn variant="text" icon target="_blank" :href="src">
        <mdi-download />
      </h-btn>
    </div>
  </div>
</template>
