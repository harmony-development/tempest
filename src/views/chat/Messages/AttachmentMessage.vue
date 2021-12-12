<script lang="ts" setup>
import { Content_AttachmentContent } from "@harmony-dev/harmony-web-sdk/dist/gen/chat/v1/messages";
import { useChatRoute } from '../../../router';
import { parseHMC } from '../../../logic/parsing';

const { host } = useChatRoute();

const props = defineProps<{
  content: Content_AttachmentContent['files'];
}>();

const hmc = (id: string) => parseHMC(id, host.value!);
</script>

<template>
  <div>
    <div v-for="file in content" :key="file.id">
      <img :src="hmc(file.id)" v-if="file.mimetype.startsWith('image/')" />
      <audio controls :src="hmc(file.id)" v-else-if="file.mimetype.startsWith('audio/')" />
      <a :href="hmc(file.id)" v-else>{{ file.name }}</a>
    </div>
  </div>
</template>
<style lang="postcss" scoped>
</style>
