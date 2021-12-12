<script lang="ts" setup>
import { Content_PhotoContent } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import FormattedText from "./FormattedText.vue";
import { useChatRoute } from '../../../router';
import { parseHMC } from '../../../logic/parsing';

const { host } = useChatRoute();

const props = defineProps<{
  content: Content_PhotoContent['photos'];
}>();
</script>

<template>
  <div>
    <img
      v-for="file in content"
      :key="file.hmc"
      :src="parseHMC(file.hmc, host!)"
      :width="file.width"
      :height="file.height"
    />
  </div>
</template>
<style lang="postcss" scoped>
</style>
