<script lang="ts" setup>
import { SiteMetadata } from "@harmony-dev/harmony-web-sdk/dist/gen/mediaproxy/v1/mediaproxy";
import ViewableImage from "~/components/shared/Image/ViewableImage.vue";

defineProps<{
  siteEmbed: SiteMetadata;
}>();
</script>

<template>
  <div
    class="
      border-l-2 border-primary-400
      p-3
      bg-harmonydark-800
      flex flex-col
      gap-2
    "
  >
    <h-link target="_blank" :href="siteEmbed.url">
      {{ siteEmbed.pageTitle }}
    </h-link>
    <p class="text-gray-400">
      {{ siteEmbed.description }}
    </p>
    <ViewableImage v-if="!!siteEmbed.image" :image-src="siteEmbed.image" />
  </div>
</template>
