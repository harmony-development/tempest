<template>
  <div v-if="mimetype.startsWith('image/')" class="w-full overflow-hidden sm:w-100 h-36 relative">
    <div
      class="absolute z-1 top-0 left-0 h-full w-1/2 bg-cover bg-no-repeat"
      :style="{ backgroundImage: `url(${hmc(id)})` }"
    />
    <div class="relative h-full z-10 image-container text-right flexcol break-all">
      <span>
        {{ name }}
      </span>
      <span v-if="size" class="text-xs text-gray-400">
        {{ $t('size-bytes', [size]) }}
      </span>
      <div class="flex-1" />
      <div>
        <base-button icon target="_blank" :href="hmc(id)">
          <mdi:download />
        </base-button>
      </div>
    </div>
  </div>
  <audio v-else-if="mimetype.startsWith('audio/')" controls :src="hmc(id)" />
  <a v-else :href="hmc(id)">{{ name }}</a>
</template>

<script setup lang="ts">import { parseHMC } from "~/logic/parsing";

const props = defineProps<{
	host: string
	mimetype: string
	id: string
	name: string
	size?: number
}>();

const hmc = (id: string) => parseHMC(id, props.host!);
</script>

<style scoped lang="postcss">

</style>
