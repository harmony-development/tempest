<script lang="ts" setup>
import { computed } from "vue";
import { parseHMC } from "../../../logic/parsing";
import { chatState } from "../../../logic/store/chat";
import BaseImage from "~/components/base/BaseImage.vue";
import BaseTooltip from "~/components/base/BaseTooltip.vue";

const props = defineProps<{
	active?: boolean
	host: string
	guildid: string
}>();

const guild = computed(() => chatState.getGuild(props.host, props.guildid), undefined);
const iconSrc = computed(() => (guild.value.data?.picture ? parseHMC(guild.value.data.picture, props.host) : undefined));
</script>

<template>
  <base-tooltip :text="guild.data?.name" placement="right">
    <button
      v-wave
      v-bind="$attrs"
      role="button"
      class="icon"
      :class="{ active }"
      style="aspect-ratio: 1"
    >
      <base-image
        :src="iconSrc"
        class="object-contain pointer-events-none"
        draggable="false"
        :alt="guild?.data?.name"
        :fallback="guild?.data?.name?.[0]"
      />
    </button>
  </base-tooltip>
</template>

<style lang="postcss" scoped>
.icon {
	@apply w-full
      bg-surface-500
      rounded-full
      cursor-pointer
      overflow-hidden
      flex-shrink-0
      select-none
      border-primary-300
      transition transition-all
      duration-100
      border-0;
	&:active {
		@apply border-4 bg-surface-600;
	}
  &:focus {
		@apply border-5;
	}
}

.active {
	@apply border-2;
}
</style>
