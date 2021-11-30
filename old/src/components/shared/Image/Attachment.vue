<script lang="ts" setup>
import { computed, defineProps } from "vue";
import ViewableImage from "./ViewableImage.vue";
import { parseHMC } from "~/logic/utils/parsing";
import { useAppRoute } from "~/logic/location";
import HBtn from "~/components/shared/HBtn.vue";

const props = defineProps<{
  fileSrc: string;
  type: string;
  fileName?: string;
  size?: number;
}>();
const route = useAppRoute();
const src = computed(() => parseHMC(props.fileSrc, route.value.host));
</script>

<template>
  <div>
    <template v-if="type.startsWith('image/')">
      <viewable-image :file-name="fileName" :image-src="src" />
    </template>
    <video v-else-if="type.startsWith('video/')" controls>
      <source :src="src" :type="type" />
    </video>
    <audio
      v-else-if="type.startsWith('audio/')"
      controls
      class="attachment"
      :src="src"
    />
    <div
      v-else
      class="outline-dotted-white border-1 p-3 bg-white text-primary-600"
    >
      <p class="text-lg">{{ fileName }}</p>
      <p class="text-xs">{{ size }} Bytes</p>
      <div class="flex mt-2">
        <h-btn variant="text" icon target="_blank" :href="src">
          <mdi-download />
        </h-btn>
      </div>
    </div>
  </div>
</template>
